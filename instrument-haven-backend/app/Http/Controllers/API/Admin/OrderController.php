<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected $orderRepository;

    public function __construct(OrderRepositoryInterface $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

    /**
     * Display a listing of the orders.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $page = $request->input('page', 1);
        $status = $request->input('status');
        $search = $request->input('search');
        
        $query = Order::with('user:id,name');
        
        // Apply status filter if provided
        if ($status) {
            $query->where('status', $status);
        }
        
        // Apply search if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        $orders = $query->paginate($perPage);
        
        // Format the response
        $formattedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'user_id' => $order->user_id,
                'user_name' => $order->user->name,
                'user_email' => $order->user->email,
                'user' => [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'email' => $order->user->email
                ],
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total' => $order->total,
                'created_at' => $order->created_at
            ];
        });
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'orders' => $formattedOrders,
                'pagination' => [
                    'total' => $orders->total(),
                    'per_page' => $orders->perPage(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'from' => $orders->firstItem(),
                    'to' => $orders->lastItem()
                ]
            ]
        ]);
    }

    /**
     * Update the specified order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $order = Order::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'nullable|string|in:pending,paid,failed,refunded',
            'tracking_number' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->orderRepository->updateStatus(
                $id,
                $request->status,
                $request->payment_status,
                $request->tracking_number
            );
            
            $order = $this->orderRepository->find($id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Order updated successfully',
                'data' => [
                    'order' => [
                        'id' => $order->id,
                        'order_number' => $order->order_number,
                        'user_id' => $order->user_id,
                        'user_name' => $order->user->name,
                        'user_email' => $order->user->email,
                        'user' => [
                            'id' => $order->user->id,
                            'name' => $order->user->name,
                            'email' => $order->user->email
                        ],
                        'status' => $order->status,
                        'payment_status' => $order->payment_status,
                        'tracking_number' => $order->tracking_number,
                        'total' => $order->total,
                        'updated_at' => $order->updated_at
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        }
    }

    /**
     * Get order statistics.
     *
     * @return \Illuminate\Http\Response
     */
    public function statistics()
    {
        $statistics = $this->orderRepository->getStatistics();
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'statistics' => $statistics
            ]
        ]);
    }
}

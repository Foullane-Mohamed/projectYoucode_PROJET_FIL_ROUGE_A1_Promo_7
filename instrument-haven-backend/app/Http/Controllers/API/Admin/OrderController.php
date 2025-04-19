<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
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
     * Display a listing of orders.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Verify admin permission
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $perPage = $request->input('per_page', 15);
        $filters = $request->only(['search', 'status', 'from_date', 'to_date']);
        
        $orders = $this->orderRepository->getWithFilters($filters, $perPage);

        return response()->json([
            'status' => 'success',
            'data' => [
                'orders' => $orders->items(),
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
     * Update the specified order's status.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Verify admin permission
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled',
            'tracking_number' => 'nullable|string|max:255',
            'carrier' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if order exists
        $order = $this->orderRepository->find($id);

        if (!$order) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], 404);
        }

        // Update order status
        $result = $this->orderRepository->updateStatus($id, $request->all());

        if (!$result) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update order status'
            ], 400);
        }

        // Get updated order
        $order = $this->orderRepository->find($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Order updated successfully',
            'data' => [
                'order' => [
                    'id' => $order->id,
                    'status' => $order->status,
                    'tracking_number' => $order->tracking_number,
                    'carrier' => $order->carrier,
                    'updated_at' => $order->updated_at
                ]
            ]
        ]);
    }

    /**
     * Get order statistics for dashboard.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics(Request $request)
    {
        // Verify admin permission
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $timeframe = $request->input('timeframe', 'month');
        $allowedTimeframes = ['today', 'week', 'month', 'year', 'all'];
        
        if (!in_array($timeframe, $allowedTimeframes)) {
            $timeframe = 'month';
        }
        
        $statistics = $this->orderRepository->getStatistics($timeframe);

        return response()->json([
            'status' => 'success',
            'data' => $statistics
        ]);
    }
}

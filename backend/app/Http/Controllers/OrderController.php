<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $query = Order::with(['user', 'products', 'paymentMethod']);
            
            // Apply filters if provided
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            // Apply date filters if provided
            if ($request->has('from_date')) {
                $query->whereDate('created_at', '>=', $request->from_date);
            }
            
            if ($request->has('to_date')) {
                $query->whereDate('created_at', '<=', $request->to_date);
            }
            
            // Apply sorting
            $sortField = $request->input('sort_field', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);
            
            // Apply limit if provided
            if ($request->has('limit')) {
                $orders = $query->limit($request->limit)->get();
            } else {
                // Paginate results
                $perPage = $request->input('per_page', 15);
                $orders = $query->paginate($perPage);
            }
            
            return response()->json([
                'status' => 'success',
                'data' => $orders
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch orders: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Display the specified order.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $order = Order::with(['user', 'products', 'paymentMethod', 'coupon'])
                ->findOrFail($id);
            
            return response()->json([
                'status' => 'success',
                'data' => $order
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order not found'
            ], Response::HTTP_NOT_FOUND);
        }
    }
    
    /**
     * Update the status of an order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,processing,completed,cancelled',
            ]);
            
            $order = Order::findOrFail($id);
            $order->status = $request->status;
            $order->save();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Order status updated successfully',
                'data' => $order
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get orders by status.
     *
     * @param  string  $status
     * @return \Illuminate\Http\Response
     */
    public function byStatus($status)
    {
        try {
            if (!in_array($status, ['pending', 'processing', 'completed', 'cancelled'])) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid status'
                ], Response::HTTP_BAD_REQUEST);
            }
            
            $orders = Order::with(['user', 'products'])
                ->where('status', $status)
                ->orderBy('created_at', 'desc')
                ->paginate(15);
            
            return response()->json([
                'status' => 'success',
                'data' => $orders
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch orders: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get orders for a specific month and year.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function monthlyOrders(Request $request)
    {
        try {
            $month = $request->input('month', date('m'));
            $year = $request->input('year', date('Y'));
            
            $orders = Order::with(['user', 'products'])
                ->whereYear('created_at', $year)
                ->whereMonth('created_at', $month)
                ->orderBy('created_at', 'desc')
                ->paginate(15);
            
            return response()->json([
                'status' => 'success',
                'data' => $orders
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch monthly orders: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get orders for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function userOrders(Request $request)
    {
        try {
            $userId = $request->user()->id;
            
            $orders = Order::with(['products', 'paymentMethod'])
                ->where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $orders
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch user orders: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
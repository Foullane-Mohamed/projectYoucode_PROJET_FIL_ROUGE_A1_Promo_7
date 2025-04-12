<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Comment;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     *
     * @return \Illuminate\Http\Response
     */
    public function getStats()
    {
        try {
            $stats = [
                'users' => User::count(),
                'products' => Product::count(),
                'orders' => Order::count(),
                'revenue' => Order::where('status', 'completed')->sum('total'),
                'categories' => Category::count(),
                'subcategories' => SubCategory::count(),
                'comments' => Comment::count(),
                'contacts' => Contact::where('status', 'pending')->count()
            ];
            
            return response()->json([
                'status' => 'success',
                'data' => $stats
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch dashboard statistics: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get recent orders.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getRecentOrders(Request $request)
    {
        try {
            $limit = $request->input('limit', 5);
            
            $orders = Order::with(['user'])
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $orders
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch recent orders: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get low stock products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getLowStockProducts(Request $request)
    {
        try {
            $limit = $request->input('limit', 10);
            $threshold = $request->input('threshold', 10);
            
            $products = Product::where('stock', '<', $threshold)
                ->orderBy('stock', 'asc')
                ->limit($limit)
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch low stock products: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    protected $orderRepository;
    protected $productRepository;

    public function __construct(
        OrderRepositoryInterface $orderRepository,
        ProductRepositoryInterface $productRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
    }

    /**
     * Get dashboard statistics.
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

        // Get counts for dashboard
        $productCount = Product::count();
        $userCount = User::count();
        $orderCount = Order::count();
        $categoryCount = DB::table('categories')->count();

        // Get recent orders for display
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        // Get top selling products
        $topProducts = $this->productRepository->getTopSelling(5);

        return response()->json([
            'status' => 'success',
            'data' => [
                'productCount' => $productCount,
                'userCount' => $userCount,
                'orderCount' => $orderCount,
                'categoryCount' => $categoryCount,
                'recentOrders' => $recentOrders,
                'topProducts' => $topProducts
            ]
        ]);
    }
}

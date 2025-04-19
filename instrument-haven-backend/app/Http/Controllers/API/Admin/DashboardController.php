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

        $timeframe = $request->input('timeframe', 'month');
        $allowedTimeframes = ['today', 'week', 'month', 'year', 'all'];
        
        if (!in_array($timeframe, $allowedTimeframes)) {
            $timeframe = 'month';
        }

        // Get sales statistics
        $sales = $this->orderRepository->getStatistics($timeframe);

        // Get product statistics
        $products = [
            'total' => Product::count(),
            'top_selling' => $this->productRepository->getTopSelling(5),
            'low_stock' => $this->productRepository->getLowStock(5, 5)
        ];

        // Get user statistics
        $users = [
            'total' => User::count(),
            'new_this_month' => User::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count()
        ];

        // Get order statistics
        $orders = [
            'pending' => Order::where('status', 'pending')->count(),
            'processing' => Order::where('status', 'processing')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
            'delivered' => Order::where('status', 'delivered')->count(),
            'cancelled' => Order::where('status', 'cancelled')->count()
        ];

        return response()->json([
            'status' => 'success',
            'data' => [
                'sales' => $sales,
                'products' => $products,
                'users' => $users,
                'orders' => $orders
            ]
        ]);
    }
}

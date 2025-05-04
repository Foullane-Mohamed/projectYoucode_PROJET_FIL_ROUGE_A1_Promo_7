<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    protected $orderRepository;

    public function __construct(OrderRepositoryInterface $orderRepository)
    {
        $this->orderRepository = $orderRepository;
    }

  
    public function statistics()
    {
        $totalSales = Order::sum('total');
        
        $totalOrders = Order::count();
        
        $totalProducts = Product::count();
        
        $totalCategories = Category::count();
        
        $totalUsers = User::count();
        
        $recentOrders = Order::orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id', 'order_number', 'total', 'status', 'created_at']);
        
        $salesByDate = Order::select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as total')
            )
            ->whereDate('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->date => $item->total];
            });
        
        $labels = [];
        $data = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $labels[] = $date;
            $data[] = $salesByDate[$date] ?? 0;
        }
        
        $topSellingProducts = DB::table('order_items')
            ->select(
                'product_id',
                'product_name',
                DB::raw('SUM(quantity) as total_sold'),
                DB::raw('SUM(total) as revenue')
            )
            ->groupBy('product_id', 'product_name')
            ->orderBy('total_sold', 'desc')
            ->take(5)
            ->get();
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'statistics' => [
                    'total_sales' => $totalSales,
                    'total_orders' => $totalOrders,
                    'total_products' => $totalProducts,
                    'total_categories' => $totalCategories,
                    'total_users' => $totalUsers,
                    'recent_orders' => $recentOrders,
                    'sales_by_date' => [
                        'labels' => $labels,
                        'data' => $data
                    ],
                    'top_selling_products' => $topSellingProducts
                ]
            ]
        ]);
    }
}

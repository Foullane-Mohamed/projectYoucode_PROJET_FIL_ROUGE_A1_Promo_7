<?php

namespace App\Repositories;

use App\Models\Order;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Services\Interfaces\OrderServiceInterface;
use Illuminate\Support\Facades\DB;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    protected $orderService;


    public function __construct(OrderServiceInterface $orderService)
    {
        parent::__construct();
        $this->orderService = $orderService;
    }

  
    public function setModel()
    {
        $this->model = new Order();
    }

    public function getByUserId($userId)
    {
        return $this->model->where('user_id', $userId)->orderBy('created_at', 'desc')->get();
    }

    public function getWithItems($id)
    {
        return $this->model->with('items')->findOrFail($id);
    }
    

    public function createFromCart($userId, $paymentMethod, $paymentId, $shippingAddress, $billingAddress)
    {
        return $this->orderService->createFromCart($userId, $paymentMethod, $paymentId, $shippingAddress, $billingAddress);
    }
    

    public function updateStatus($id, $status, $paymentStatus = null, $trackingNumber = null)
    {
        $order = $this->find($id);
        
        $data = ['status' => $status];
        
        if ($paymentStatus) {
            $data['payment_status'] = $paymentStatus;
        }
        
        if ($trackingNumber) {
            $data['tracking_number'] = $trackingNumber;
        }
        
        return $order->update($data);
    }
    

    public function cancelOrder($id)
    {
        return $this->updateStatus($id, 'cancelled');
    }
    

    public function getStatistics()
    {
        $totalOrders = $this->model->count();
        $totalSales = $this->model->sum('total');
        $averageOrderValue = $totalOrders > 0 ? $totalSales / $totalOrders : 0;
        
        $ordersByStatus = $this->model
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();
        
        $ordersByMonth = $this->model
            ->select(DB::raw('YEAR(created_at) as year'), DB::raw('MONTH(created_at) as month'), DB::raw('count(*) as count'))
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => date('M', mktime(0, 0, 0, $item->month, 1)),
                    'count' => $item->count,
                ];
            });
        
        return [
            'total_orders' => $totalOrders,
            'total_sales' => $totalSales,
            'average_order_value' => $averageOrderValue,
            'orders_by_status' => $ordersByStatus,
            'orders_by_month' => [
                'labels' => $ordersByMonth->pluck('month')->toArray(),
                'data' => $ordersByMonth->pluck('count')->toArray(),
            ],
        ];
    }
}

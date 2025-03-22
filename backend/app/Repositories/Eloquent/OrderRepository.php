<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Repositories\Interfaces\OrderRepositoryInterface;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    public function findByUser(int $userId)
    {
        return $this->model->where('user_id', $userId)->with(['products', 'paymentMethod'])->get();
    }

    public function findByStatus(string $status)
    {
        return $this->model->where('status', $status)->with(['user', 'products', 'paymentMethod'])->get();
    }

    public function updateOrderStatus(int $id, string $status)
    {
        $order = $this->findById($id);
        $order->status = $status;
        $order->save();
        return $order;
    }

    public function getOrdersWithProducts()
    {
        return $this->model->with(['user', 'products', 'paymentMethod', 'coupon'])->get();
    }

    public function getMonthlyOrders(int $month, int $year)
    {
        return $this->model->whereYear('created_at', $year)
                          ->whereMonth('created_at', $month)
                          ->with(['user', 'products', 'paymentMethod', 'coupon'])
                          ->get();
    }
}
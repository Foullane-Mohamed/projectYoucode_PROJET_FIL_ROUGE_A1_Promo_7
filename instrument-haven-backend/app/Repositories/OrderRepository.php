<?php

namespace App\Repositories;

use App\Models\Order;

class OrderRepository extends BaseRepository
{
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    public function getOrdersByUser($userId)
    {
        return $this->model->where('user_id', $userId)->get();
    }

    public function getOrdersByStatus($status)
    {
        return $this->model->where('status', $status)->get();
    }
}
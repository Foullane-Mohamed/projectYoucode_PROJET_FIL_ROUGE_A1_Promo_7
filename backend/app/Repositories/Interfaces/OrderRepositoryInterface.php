<?php

namespace App\Repositories\Interfaces;

interface OrderRepositoryInterface extends BaseRepositoryInterface
{
    public function findByUser(int $userId);
    public function findByStatus(string $status);
    public function updateOrderStatus(int $id, string $status);
    public function getOrdersWithProducts();
    public function getMonthlyOrders(int $month, int $year);
}
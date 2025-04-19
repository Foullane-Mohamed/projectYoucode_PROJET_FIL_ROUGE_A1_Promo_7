<?php

namespace App\Repositories\Interfaces;

interface OrderRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get orders with filters
     *
     * @param array $filters
     * @param int $perPage
     * @return mixed
     */
    public function getWithFilters(array $filters, int $perPage = 15);

    /**
     * Get order with details
     *
     * @param int $id
     * @return mixed
     */
    public function getWithDetails(int $id);

    /**
     * Get orders for user
     *
     * @param int $userId
     * @param array $filters
     * @param int $perPage
     * @return mixed
     */
    public function getForUser(int $userId, array $filters = [], int $perPage = 10);

    /**
     * Create order from cart
     *
     * @param int $userId
     * @param array $orderData
     * @return mixed
     */
    public function createFromCart(int $userId, array $orderData);

    /**
     * Cancel order
     *
     * @param int $orderId
     * @param string $reason
     * @return mixed
     */
    public function cancelOrder(int $orderId, string $reason);

    /**
     * Update order status
     *
     * @param int $orderId
     * @param array $data
     * @return mixed
     */
    public function updateStatus(int $orderId, array $data);

    /**
     * Get order statistics
     *
     * @param string $timeframe
     * @return mixed
     */
    public function getStatistics(string $timeframe = 'month');
}

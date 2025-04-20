<?php

namespace App\Repositories\Interfaces;

interface OrderRepositoryInterface extends RepositoryInterface
{
    /**
     * Get orders by user id
     * 
     * @param int $userId
     * @return mixed
     */
    public function getByUserId($userId);
    
    /**
     * Get order with items
     * 
     * @param int $id
     * @return mixed
     */
    public function getWithItems($id);
    
    /**
     * Create order from cart
     * 
     * @param int $userId
     * @param string $paymentMethod
     * @param string $paymentId
     * @param array $shippingAddress
     * @param array $billingAddress
     * @return mixed
     */
    public function createFromCart($userId, $paymentMethod, $paymentId, $shippingAddress, $billingAddress);
    
    /**
     * Update order status
     * 
     * @param int $id
     * @param string $status
     * @param string $paymentStatus
     * @param string $trackingNumber
     * @return mixed
     */
    public function updateStatus($id, $status, $paymentStatus = null, $trackingNumber = null);
    
    /**
     * Cancel order
     * 
     * @param int $id
     * @return mixed
     */
    public function cancelOrder($id);
    
    /**
     * Get order statistics
     * 
     * @return mixed
     */
    public function getStatistics();
}

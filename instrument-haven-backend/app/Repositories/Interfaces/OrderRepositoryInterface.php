<?php

namespace App\Repositories\Interfaces;

interface OrderRepositoryInterface extends RepositoryInterface
{

    public function getByUserId($userId);
    

    public function getWithItems($id);
    

    public function createFromCart($userId, $paymentMethod, $paymentId, $shippingAddress, $billingAddress);
    

    public function updateStatus($id, $status, $paymentStatus = null, $trackingNumber = null);
    
    
    public function cancelOrder($id);
    

    public function getStatistics();
}

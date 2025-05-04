<?php

namespace App\Services\Interfaces;

interface OrderServiceInterface
{

    public function generateOrderNumber();

    public function createFromCart($userId, $paymentMethod, $paymentId, $shippingAddress, $billingAddress, $taxRate, $shippingCost);
}

<?php

namespace App\Services\Interfaces;

use App\Models\CartItem;

interface CartItemServiceInterface
{

    public function calculateTotal(CartItem $cartItem);
}

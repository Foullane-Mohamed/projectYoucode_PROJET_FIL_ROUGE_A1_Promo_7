<?php

namespace App\Services;

use App\Models\CartItem;
use App\Services\Interfaces\CartItemServiceInterface;

class CartItemService implements CartItemServiceInterface
{

    public function calculateTotal(CartItem $cartItem)
    {
        return $cartItem->quantity * $cartItem->price;
    }
}

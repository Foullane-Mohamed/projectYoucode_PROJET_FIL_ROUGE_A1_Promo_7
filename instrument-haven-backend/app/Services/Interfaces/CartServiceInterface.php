<?php

namespace App\Services\Interfaces;

use App\Models\Cart;

interface CartServiceInterface
{

    public function addProduct(Cart $cart, $productId, $quantity = 1);

    public function updateProductQuantity(Cart $cart, $cartItemId, $quantity);
  

    public function removeProduct(Cart $cart, $cartItemId);

    public function applyCoupon(Cart $cart, $couponCode);
  

    public function removeCoupon(Cart $cart);


    public function calculateSubtotal(Cart $cart);


    public function calculateDiscount(Cart $cart);

  
    public function calculateTotal(Cart $cart);
}

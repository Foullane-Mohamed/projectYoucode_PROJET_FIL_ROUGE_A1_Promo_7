<?php

namespace App\Repositories\Interfaces;

interface CartRepositoryInterface extends RepositoryInterface
{
  
    public function getByUserId($userId);
    

    public function getWithItemsByUserId($userId);
    
  
    public function addItem($userId, $productId, $quantity);
    

    public function updateItemQuantity($userId, $itemId, $quantity);
    
  
    public function removeItem($userId, $itemId);
    
  
    public function applyCoupon($userId, $couponCode);
    

    public function removeCoupon($userId);
}

<?php

namespace App\Repositories\Interfaces;

interface CartRepositoryInterface extends RepositoryInterface
{
    /**
     * Get cart by user id
     * 
     * @param int $userId
     * @return mixed
     */
    public function getByUserId($userId);
    
    /**
     * Get cart with items by user id
     * 
     * @param int $userId
     * @return mixed
     */
    public function getWithItemsByUserId($userId);
    
    /**
     * Add item to cart
     * 
     * @param int $userId
     * @param int $productId
     * @param int $quantity
     * @return mixed
     */
    public function addItem($userId, $productId, $quantity);
    
    /**
     * Update item quantity
     * 
     * @param int $userId
     * @param int $itemId
     * @param int $quantity
     * @return mixed
     */
    public function updateItemQuantity($userId, $itemId, $quantity);
    
    /**
     * Remove item from cart
     * 
     * @param int $userId
     * @param int $itemId
     * @return mixed
     */
    public function removeItem($userId, $itemId);
    
    /**
     * Apply coupon to cart
     * 
     * @param int $userId
     * @param string $couponCode
     * @return mixed
     */
    public function applyCoupon($userId, $couponCode);
    
    /**
     * Remove coupon from cart
     * 
     * @param int $userId
     * @return mixed
     */
    public function removeCoupon($userId);
}

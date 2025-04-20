<?php

namespace App\Repositories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Repositories\Interfaces\CartRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CartRepository extends BaseRepository implements CartRepositoryInterface
{
    /**
     * Set model
     */
    public function setModel()
    {
        $this->model = new Cart();
    }

    /**
     * Get cart by user id
     * 
     * @param int $userId
     * @return mixed
     */
    public function getByUserId($userId)
    {
        return $this->model->where('user_id', $userId)->first();
    }
    
    /**
     * Get cart with items by user id
     * 
     * @param int $userId
     * @return mixed
     */
    public function getWithItemsByUserId($userId)
    {
        $cart = $this->model
            ->where('user_id', $userId)
            ->with(['items.product', 'coupon'])
            ->first();
        
        if (!$cart) {
            $cart = $this->model->create(['user_id' => $userId]);
        }
        
        return $cart;
    }
    
    /**
     * Add item to cart
     * 
     * @param int $userId
     * @param int $productId
     * @param int $quantity
     * @return mixed
     */
    public function addItem($userId, $productId, $quantity)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $cart->addProduct($productId, $quantity);
    }
    
    /**
     * Update item quantity
     * 
     * @param int $userId
     * @param int $itemId
     * @param int $quantity
     * @return mixed
     */
    public function updateItemQuantity($userId, $itemId, $quantity)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $cart->updateProductQuantity($itemId, $quantity);
    }
    
    /**
     * Remove item from cart
     * 
     * @param int $userId
     * @param int $itemId
     * @return mixed
     */
    public function removeItem($userId, $itemId)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $cart->removeProduct($itemId);
    }
    
    /**
     * Apply coupon to cart
     * 
     * @param int $userId
     * @param string $couponCode
     * @return mixed
     */
    public function applyCoupon($userId, $couponCode)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $cart->applyCoupon($couponCode);
    }
    
    /**
     * Remove coupon from cart
     * 
     * @param int $userId
     * @return mixed
     */
    public function removeCoupon($userId)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $cart->removeCoupon();
    }
}

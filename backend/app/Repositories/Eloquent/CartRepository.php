<?php

namespace App\Repositories\Eloquent;

use App\Models\Cart;
use App\Repositories\Interfaces\CartRepositoryInterface;

class CartRepository extends BaseRepository implements CartRepositoryInterface
{
    public function __construct(Cart $model)
    {
        parent::__construct($model);
    }

    public function findByUser(int $userId)
    {
        return $this->model->where('user_id', $userId)->with('product')->get();
    }

    public function findByUserAndProduct(int $userId, int $productId)
    {
        return $this->model->where('user_id', $userId)
                          ->where('product_id', $productId)
                          ->first();
    }

    public function updateQuantity(int $userId, int $productId, int $quantity)
    {
        $item = $this->findByUserAndProduct($userId, $productId);
        
        if ($item) {
            if ($quantity <= 0) {
                // Remove item if quantity is 0 or negative
                $item->delete();
                return null;
            } else {
                $item->quantity = $quantity;
                $item->save();
                return $item;
            }
        }
        
        return null;
    }

    public function clearCart(int $userId)
    {
        return $this->model->where('user_id', $userId)->delete();
    }

    public function getCartTotal(int $userId)
    {
        $cartItems = $this->findByUser($userId);
        $total = 0;
        
        foreach ($cartItems as $item) {
            $total += $item->product->price * $item->quantity;
        }
        
        return $total;
    }
}
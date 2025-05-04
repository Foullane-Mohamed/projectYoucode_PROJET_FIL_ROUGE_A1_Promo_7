<?php

namespace App\Repositories;

use App\Models\Wishlist;
use App\Repositories\Interfaces\WishlistRepositoryInterface;

class WishlistRepository extends BaseRepository implements WishlistRepositoryInterface
{

    public function setModel()
    {
        $this->model = new Wishlist();
    }


    public function getByUserId($userId)
    {
        return $this->model->where('user_id', $userId)->with('product')->get();
    }
    

    public function addProduct($userId, $productId)
    {
        $exists = $this->isProductInWishlist($userId, $productId);
        
        if ($exists) {
            return null;
        }
        
        return $this->model->create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);
    }
    
  
    public function removeProduct($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->delete();
    }
    

    public function isProductInWishlist($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }
}

<?php

namespace App\Repositories;

use App\Models\Wishlist;
use App\Repositories\Interfaces\WishlistRepositoryInterface;

class WishlistRepository extends BaseRepository implements WishlistRepositoryInterface
{
    /**
     * Set model
     */
    public function setModel()
    {
        $this->model = new Wishlist();
    }

    /**
     * Get wishlist by user id
     * 
     * @param int $userId
     * @return mixed
     */
    public function getByUserId($userId)
    {
        return $this->model->where('user_id', $userId)->with('product')->get();
    }
    
    /**
     * Add product to wishlist
     * 
     * @param int $userId
     * @param int $productId
     * @return mixed
     */
    public function addProduct($userId, $productId)
    {
        // Check if product is already in wishlist
        $exists = $this->isProductInWishlist($userId, $productId);
        
        if ($exists) {
            return null;
        }
        
        return $this->model->create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);
    }
    
    /**
     * Remove product from wishlist
     * 
     * @param int $userId
     * @param int $productId
     * @return mixed
     */
    public function removeProduct($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->delete();
    }
    
    /**
     * Check if product is in wishlist
     * 
     * @param int $userId
     * @param int $productId
     * @return bool
     */
    public function isProductInWishlist($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->exists();
    }
}

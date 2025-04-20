<?php

namespace App\Repositories\Interfaces;

interface WishlistRepositoryInterface extends RepositoryInterface
{
    /**
     * Get wishlist by user id
     * 
     * @param int $userId
     * @return mixed
     */
    public function getByUserId($userId);
    
    /**
     * Add product to wishlist
     * 
     * @param int $userId
     * @param int $productId
     * @return mixed
     */
    public function addProduct($userId, $productId);
    
    /**
     * Remove product from wishlist
     * 
     * @param int $userId
     * @param int $productId
     * @return mixed
     */
    public function removeProduct($userId, $productId);
    
    /**
     * Check if product is in wishlist
     * 
     * @param int $userId
     * @param int $productId
     * @return bool
     */
    public function isProductInWishlist($userId, $productId);
}

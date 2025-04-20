<?php

namespace App\Repositories\Interfaces;

interface ReviewRepositoryInterface extends RepositoryInterface
{
    /**
     * Get reviews by product id
     * 
     * @param int $productId
     * @return mixed
     */
    public function getByProductId($productId);
    
    /**
     * Get review by user id and product id
     * 
     * @param int $userId
     * @param int $productId
     * @return mixed
     */
    public function getByUserIdAndProductId($userId, $productId);
    
    /**
     * Create or update review
     * 
     * @param int $userId
     * @param int $productId
     * @param int $rating
     * @param string $comment
     * @return mixed
     */
    public function createOrUpdate($userId, $productId, $rating, $comment = null);
    
    /**
     * Delete review
     * 
     * @param int $userId
     * @param int $productId
     * @return mixed
     */
    public function deleteByUserIdAndProductId($userId, $productId);
}

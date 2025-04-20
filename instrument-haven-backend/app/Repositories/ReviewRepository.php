<?php

namespace App\Repositories;

use App\Models\Review;
use App\Repositories\Interfaces\ReviewRepositoryInterface;

class ReviewRepository extends BaseRepository implements ReviewRepositoryInterface
{
    /**
     * Set model
     */
    public function setModel()
    {
        $this->model = new Review();
    }

    /**
     * Get reviews by product id
     * 
     * @param int $productId
     * @return mixed
     */
    public function getByProductId($productId)
    {
        return $this->model->where('product_id', $productId)->with('user')->get();
    }
    
    /**
     * Get review by user id and product id
     * 
     * @param int $userId
     * @param int $productId
     * @return mixed
     */
    public function getByUserIdAndProductId($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();
    }
    
    /**
     * Create or update review
     * 
     * @param int $userId
     * @param int $productId
     * @param int $rating
     * @param string $comment
     * @return mixed
     */
    public function createOrUpdate($userId, $productId, $rating, $comment = null)
    {
        $review = $this->getByUserIdAndProductId($userId, $productId);
        
        if ($review) {
            $review->rating = $rating;
            $review->comment = $comment;
            $review->save();
            
            return $review;
        }
        
        return $this->model->create([
            'user_id' => $userId,
            'product_id' => $productId,
            'rating' => $rating,
            'comment' => $comment,
        ]);
    }
    
    /**
     * Delete review
     * 
     * @param int $userId
     * @param int $productId
     * @return mixed
     */
    public function deleteByUserIdAndProductId($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->delete();
    }
}

<?php

namespace App\Repositories;

use App\Models\Review;
use App\Repositories\Interfaces\ReviewRepositoryInterface;

class ReviewRepository extends BaseRepository implements ReviewRepositoryInterface
{

    public function setModel()
    {
        $this->model = new Review();
    }

    
    public function getByProductId($productId)
    {
        return $this->model->where('product_id', $productId)->with('user')->get();
    }
    

    public function getByUserIdAndProductId($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();
    }

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
    

    public function deleteByUserIdAndProductId($userId, $productId)
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->delete();
    }
}

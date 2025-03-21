<?php

namespace App\Repositories\Eloquent;

use App\Models\Comment;
use App\Repositories\Interfaces\CommentRepositoryInterface;

class CommentRepository extends BaseRepository implements CommentRepositoryInterface
{
    public function __construct(Comment $model)
    {
        parent::__construct($model);
    }

    public function findByProduct(int $productId)
    {
        return $this->model->where('product_id', $productId)
                          ->with('user')
                          ->latest()
                          ->get();
    }

    public function findByUser(int $userId)
    {
        return $this->model->where('user_id', $userId)
                          ->with('product')
                          ->latest()
                          ->get();
    }

    public function getProductRating(int $productId)
    {
        $comments = $this->model->where('product_id', $productId)->get();
        
        if ($comments->isEmpty()) {
            return 0;
        }
        
        return $comments->avg('rating');
    }
}
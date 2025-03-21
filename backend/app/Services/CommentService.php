<?php

namespace App\Services;

use App\Repositories\Interfaces\CommentRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Log;

class CommentService
{
    protected $commentRepository;

    public function __construct(CommentRepositoryInterface $commentRepository)
    {
        $this->commentRepository = $commentRepository;
    }

    public function getAllComments()
    {
        return $this->commentRepository->all(['*'], ['user', 'product']);
    }

    public function getCommentById(int $id)
    {
        return $this->commentRepository->findById($id, ['*'], ['user', 'product']);
    }

    public function createComment(array $attributes)
    {
        try {
            return $this->commentRepository->create($attributes);
        } catch (Exception $e) {
            Log::error('Error creating comment: ' . $e->getMessage());
            throw new Exception('Unable to create comment: ' . $e->getMessage());
        }
    }

    public function updateComment(int $id, array $attributes)
    {
        try {
            return $this->commentRepository->update($id, $attributes);
        } catch (Exception $e) {
            Log::error('Error updating comment: ' . $e->getMessage());
            throw new Exception('Unable to update comment: ' . $e->getMessage());
        }
    }

    public function deleteComment(int $id)
    {
        try {
            return $this->commentRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error deleting comment: ' . $e->getMessage());
            throw new Exception('Unable to delete comment: ' . $e->getMessage());
        }
    }

    public function getCommentsByProduct(int $productId)
    {
        return $this->commentRepository->findByProduct($productId);
    }

    public function getCommentsByUser(int $userId)
    {
        return $this->commentRepository->findByUser($userId);
    }

    public function getProductRating(int $productId)
    {
        return $this->commentRepository->getProductRating($productId);
    }
}
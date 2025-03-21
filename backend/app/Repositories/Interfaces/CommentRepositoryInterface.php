<?php

namespace App\Repositories\Interfaces;

interface CommentRepositoryInterface extends BaseRepositoryInterface
{
    public function findByProduct(int $productId);
    public function findByUser(int $userId);
    public function getProductRating(int $productId);
}
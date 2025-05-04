<?php

namespace App\Repositories\Interfaces;

interface ReviewRepositoryInterface extends RepositoryInterface
{

    public function getByProductId($productId);
    
  
    public function getByUserIdAndProductId($userId, $productId);
    

    public function createOrUpdate($userId, $productId, $rating, $comment = null);
    

    public function deleteByUserIdAndProductId($userId, $productId);
}

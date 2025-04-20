<?php

namespace App\Repositories\Interfaces;

interface TagRepositoryInterface extends RepositoryInterface
{
    /**
     * Attach tag to product
     * 
     * @param int $tagId
     * @param int $productId
     * @return mixed
     */
    public function attachToProduct($tagId, $productId);
    
    /**
     * Detach tag from product
     * 
     * @param int $tagId
     * @param int $productId
     * @return mixed
     */
    public function detachFromProduct($tagId, $productId);
    
    /**
     * Sync tags for product
     * 
     * @param int $productId
     * @param array $tagIds
     * @return mixed
     */
    public function syncForProduct($productId, $tagIds);
}

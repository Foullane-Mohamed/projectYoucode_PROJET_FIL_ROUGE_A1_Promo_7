<?php

namespace App\Repositories;

use App\Models\Product;
use App\Models\Tag;
use App\Repositories\Interfaces\TagRepositoryInterface;

class TagRepository extends BaseRepository implements TagRepositoryInterface
{
    /**
     * Set model
     */
    public function setModel()
    {
        $this->model = new Tag();
    }

    /**
     * Attach tag to product
     * 
     * @param int $tagId
     * @param int $productId
     * @return mixed
     */
    public function attachToProduct($tagId, $productId)
    {
        $product = Product::findOrFail($productId);
        
        return $product->tags()->attach($tagId);
    }
    
    /**
     * Detach tag from product
     * 
     * @param int $tagId
     * @param int $productId
     * @return mixed
     */
    public function detachFromProduct($tagId, $productId)
    {
        $product = Product::findOrFail($productId);
        
        return $product->tags()->detach($tagId);
    }
    
    /**
     * Sync tags for product
     * 
     * @param int $productId
     * @param array $tagIds
     * @return mixed
     */
    public function syncForProduct($productId, $tagIds)
    {
        $product = Product::findOrFail($productId);
        
        return $product->tags()->sync($tagIds);
    }
}

<?php

namespace App\Repositories\Interfaces;

interface ProductRepositoryInterface extends RepositoryInterface
{
    /**
     * Find products by category id
     * 
     * @param int $categoryId
     * @return mixed
     */
    public function findByCategoryId($categoryId);
    
    /**
     * Search products
     * 
     * @param string $term
     * @return mixed
     */
    public function search($term);
    
    /**
     * Filter products
     * 
     * @param array $filters
     * @return mixed
     */
    public function filter($filters);
}

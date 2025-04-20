<?php

namespace App\Repositories\Interfaces;

interface CategoryRepositoryInterface extends RepositoryInterface
{
    /**
     * Get root categories
     * 
     * @return mixed
     */
    public function getRootCategories();
    
    /**
     * Get category with its products
     * 
     * @param int $id
     * @return mixed
     */
    public function getCategoryWithProducts($id);
}

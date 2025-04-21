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
    
    /**
     * Get paginated categories with filters
     * 
     * @param int $perPage
     * @param array $filters
     * @param string $orderBy
     * @param string $direction
     * @return mixed
     */
    public function paginateWithFilters($perPage, array $filters, $orderBy, $direction);
}

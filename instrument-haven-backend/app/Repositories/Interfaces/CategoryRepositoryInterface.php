<?php

namespace App\Repositories\Interfaces;

interface CategoryRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all categories with subcategories
     *
     * @return mixed
     */
    public function getAllWithSubcategories();

    /**
     * Get category with subcategories
     *
     * @param int $id
     * @return mixed
     */
    public function getWithSubcategories(int $id);

    /**
     * Find category by slug
     *
     * @param string $slug
     * @return mixed
     */
    public function findBySlug(string $slug);

    /**
     * Get root categories
     *
     * @return mixed
     */
    public function getRootCategories();

    /**
     * Get subcategories for a category
     *
     * @param int $categoryId
     * @return mixed
     */
    public function getSubcategories(int $categoryId);
    
    /**
     * Get category with subcategories and products
     *
     * @param int $id
     * @return mixed
     */
    public function getWithProductsAndSubcategories(int $id);
}

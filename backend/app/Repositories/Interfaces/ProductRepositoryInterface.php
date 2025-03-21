<?php

namespace App\Repositories\Interfaces;

interface ProductRepositoryInterface extends BaseRepositoryInterface
{
    public function findBySubcategory(int $subcategoryId);
    public function searchProducts(string $term);
    public function getLatestProducts(int $limit = 8);
    public function getProductsOnSale(int $limit = 8);
    public function findWithinPriceRange(float $min, float $max);
    public function updateStock(int $id, int $quantity);
}
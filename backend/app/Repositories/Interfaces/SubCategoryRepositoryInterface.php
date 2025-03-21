<?php

namespace App\Repositories\Interfaces;

interface SubCategoryRepositoryInterface extends BaseRepositoryInterface
{
    public function findByCategory(int $categoryId);
    public function findByName(string $name);
    public function findWithProducts();
}
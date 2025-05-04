<?php

namespace App\Repositories\Interfaces;

interface ProductRepositoryInterface extends RepositoryInterface
{

    public function findByCategoryId($categoryId);

    public function search($term);

    public function filter($filters);
}

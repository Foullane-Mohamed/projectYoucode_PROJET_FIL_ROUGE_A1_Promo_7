<?php

namespace App\Repositories\Interfaces;

interface ProductRepositoryInterface extends RepositoryInterface
{
    public function findBySlug($slug);
    public function getByCategory($categoryId);
    public function getFeatured();
    public function search($term);
    public function filter(array $filters);
}
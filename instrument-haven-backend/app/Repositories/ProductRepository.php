<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository extends BaseRepository
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function getProductsByCategory($categoryId)
    {
        return $this->model->where('category_id', $categoryId)->get();
    }

    public function getProductsByTag($tagId)
    {
        return $this->model->whereHas('tags', function ($query) use ($tagId) {
            $query->where('tags.id', $tagId);
        })->get();
    }

    public function searchProducts($query)
    {
        return $this->model->where('name', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->get();
    }
}
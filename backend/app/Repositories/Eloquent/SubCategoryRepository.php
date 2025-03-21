<?php

namespace App\Repositories\Eloquent;

use App\Models\SubCategory;
use App\Repositories\Interfaces\SubCategoryRepositoryInterface;

class SubCategoryRepository extends BaseRepository implements SubCategoryRepositoryInterface
{
    public function __construct(SubCategory $model)
    {
        parent::__construct($model);
    }

    public function findByCategory(int $categoryId)
    {
        return $this->model->where('category_id', $categoryId)->get();
    }

    public function findByName(string $name)
    {
        return $this->model->where('name', 'like', "%{$name}%")->get();
    }

    public function findWithProducts()
    {
        return $this->model->with('products')->get();
    }
}
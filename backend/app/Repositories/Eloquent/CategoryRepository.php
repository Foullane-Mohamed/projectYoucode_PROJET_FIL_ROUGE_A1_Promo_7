<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    public function findWithSubcategories()
    {
        return $this->model->with('subcategories')->get();
    }

    public function findByName(string $name)
    {
        return $this->model->where('name', 'like', "%{$name}%")->get();
    }
}
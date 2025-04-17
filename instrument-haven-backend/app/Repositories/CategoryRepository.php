<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository extends BaseRepository
{
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    public function getParentCategories()
    {
        return $this->model->whereNull('parent_id')->get();
    }

    public function getCategoryWithSubcategories($id)
    {
        return $this->model->with('children')->findOrFail($id);
    }
}
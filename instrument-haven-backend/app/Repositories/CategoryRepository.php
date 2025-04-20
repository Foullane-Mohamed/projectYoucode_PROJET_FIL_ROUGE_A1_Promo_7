<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    /**
     * Set model
     */
    public function setModel()
    {
        $this->model = new Category();
    }

    /**
     * Get root categories
     * 
     * @return mixed
     */
    public function getRootCategories()
    {
        return $this->model->whereNull('parent_id')->get();
    }
    
    /**
     * Get category with its products
     * 
     * @param int $id
     * @return mixed
     */
    public function getCategoryWithProducts($id)
    {
        return $this->model->with('products')->findOrFail($id);
    }
}

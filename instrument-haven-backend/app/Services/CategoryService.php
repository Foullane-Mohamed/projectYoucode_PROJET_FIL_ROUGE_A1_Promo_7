<?php

namespace App\Services;

use App\Models\Category;
use App\Services\Interfaces\CategoryServiceInterface;
use Illuminate\Support\Str;

class CategoryService implements CategoryServiceInterface
{

    public function generateSlug($name, $currentSlug = null)
    {
        return $currentSlug ?? Str::slug($name);
    }
    

    public function getProductCount(Category $category)
    {
        return $category->products()->count();
    }
}

<?php

namespace App\Services\Interfaces;

use App\Models\Category;

interface CategoryServiceInterface
{
  
    public function generateSlug($name, $currentSlug = null);
    

    public function getProductCount(Category $category);
}

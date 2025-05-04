<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }


    public function index()
    {
        $categories = $this->categoryRepository->all();
        
        $categories->each(function ($category) {
            $category->product_count = $category->getProductCountAttribute();
        });
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'categories' => $categories
            ]
        ]);
    }


    public function show($id)
    {
        try {
            $category = $this->categoryRepository->getCategoryWithProducts($id);
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'category' => $category
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found'
            ], 404);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }
    
  
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10); 
        $search = $request->input('search', '');
        $orderBy = $request->input('order_by', 'id');
        $direction = $request->input('direction', 'asc');
        
        $filters = [];
        if (!empty($search)) {
            $filters['search'] = $search;
        }
        
        $categories = $this->categoryRepository->paginateWithFilters(
            $perPage,
            $filters,
            $orderBy,
            $direction
        );
        
        $categories->getCollection()->each(function ($category) {
            $category->product_count = $category->products()->count();
        });
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'categories' => $categories
            ]
        ]);
    }


    public function store(Request $request)
    {
        \Log::info('Category create request:', $request->all());
        \Log::info('Files in request:', $request->allFiles());
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:categories',
            'description' => 'nullable|string',
            'image' => 'nullable|file|image|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $categoryData = $request->except('image');
        $categoryData['slug'] = Str::slug($request->name);
        
        if ($request->hasFile('image')) {
            try {
                $image = $request->file('image');
                
                $timestamp = time();
                $extension = $image->getClientOriginalExtension();
                $filename = "category_{$timestamp}_{$request->name}.{$extension}";
                
                $path = $image->storeAs('categories', $filename, 'public');
                
                \Log::info("Image stored successfully at: {$path}");
                
                $categoryData['image_url'] = $path;
            } catch (\Exception $e) {
                \Log::error("Failed to store image: " . $e->getMessage());
                \Log::error($e->getTraceAsString());
            }
        }
        
        $category = $this->categoryRepository->create($categoryData);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Category created successfully',
            'data' => [
                'category' => $category
            ]
        ], 201);
    }

    public function update(Request $request, $id)
    {
        \Log::info("Category update request for ID {$id}:", $request->all());
        \Log::info('Files in update request:', $request->allFiles());
        
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
            'image' => 'nullable|file|image|max:2048'
        ]);

        if ($validator->fails()) {
            \Log::error('Category validation failed:', $validator->errors()->toArray());
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $existingCategory = $this->categoryRepository->find($id);
            
            $categoryData = $request->except('image');
            
            if (isset($categoryData['name'])) {
                $categoryData['slug'] = Str::slug($categoryData['name']);
            }
            
            if ($request->hasFile('image')) {
                try {
                    $image = $request->file('image');
                    
                    $timestamp = time();
                    $categoryName = isset($categoryData['name']) ? $categoryData['name'] : $existingCategory->name;
                    $extension = $image->getClientOriginalExtension();
                    $filename = "category_{$timestamp}_{$id}_{$categoryName}.{$extension}";
                    
                    $path = $image->storeAs('categories', $filename, 'public');
                    
                    \Log::info("Update image stored successfully at: {$path}");
                    
                    $categoryData['image_url'] = $path;
                } catch (\Exception $e) {
                    \Log::error("Failed to store update image: " . $e->getMessage());
                    \Log::error($e->getTraceAsString());
                }
            }
            
            $this->categoryRepository->update($categoryData, $id);
            
            $category = $this->categoryRepository->find($id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Category updated successfully',
                'data' => [
                    'category' => $category
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error("Error updating category: " . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found or update failed'
            ], 404);
        }
    }

  
    public function destroy($id)
    {
        try {
            $category = $this->categoryRepository->find($id);
            
            if ($category->products()->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete category with products'
                ], 400);
            }
            

            
            $this->categoryRepository->delete($id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Category deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found'
            ], 404);
        }
    }
}

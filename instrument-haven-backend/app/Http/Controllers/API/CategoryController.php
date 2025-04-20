<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    /**
     * Display a listing of the categories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $categories = $this->categoryRepository->getAllWithSubcategories();

        return response()->json([
            'status' => 'success',
            'data' => [
                'categories' => $categories
            ]
        ]);
    }

    /**
     * Display the specified category.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        // Check if we should include products
        $includeProducts = request('include') === 'products';
        
        if ($includeProducts) {
            $category = $this->categoryRepository->getWithProductsAndSubcategories($id);
        } else {
            $category = $this->categoryRepository->getWithSubcategories($id);
        }

        if (!$category) {
            return response()->json([
                'status' => 'error',
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'category' => $category
            ]
        ]);
    }

    /**
     * Store a newly created category in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|string',
                'parent_id' => 'nullable|exists:categories,id',
                'slug' => 'nullable|string|unique:categories',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string',
                'position' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();
            
            // Generate slug if not provided
            if (!isset($data['slug']) || empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }
            
            // Set defaults
            $data['is_active'] = $data['is_active'] ?? true;
            $data['position'] = $data['position'] ?? 0;
            
            // Create category
            $category = $this->categoryRepository->create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Category created successfully',
                'data' => [
                    'category' => $category
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the category',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Update the specified category in storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|string',
                'parent_id' => 'nullable|exists:categories,id',
                'slug' => 'nullable|string|unique:categories,slug,' . $id,
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string',
                'position' => 'nullable|integer|min:0',
                'is_active' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if category exists
            $category = $this->categoryRepository->find($id);

            if (!$category) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Category not found'
                ], 404);
            }

            // Check that we're not setting the category as its own parent
            if (isset($request->parent_id) && $request->parent_id == $id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'A category cannot be its own parent'
                ], 422);
            }

            $data = $request->all();
            
            // Update slug if name changed and slug not provided
            if (isset($data['name']) && $data['name'] !== $category->name && (!isset($data['slug']) || empty($data['slug']))) {
                $data['slug'] = Str::slug($data['name']);
            }
            
            // Update category
            $this->categoryRepository->update($id, $data);
            $category = $this->categoryRepository->find($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Category updated successfully',
                'data' => [
                    'category' => $category
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the category',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Remove the specified category from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            // Check if category exists
            $category = $this->categoryRepository->find($id);

            if (!$category) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Category not found'
                ], 404);
            }

            // Check if category has subcategories
            if ($category->subcategories()->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete category with subcategories'
                ], 422);
            }

            // Check if category has products
            if ($category->products()->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Cannot delete category with products'
                ], 422);
            }

            // Delete category
            $this->categoryRepository->delete($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Category deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while deleting the category',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    private $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function index()
    {
        $categories = $this->categoryRepository->all();
        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function show($id)
    {
        $category = $this->categoryRepository->find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|string',
            'active' => 'nullable|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        
        $category = $this->categoryRepository->create($validated);
        
        return response()->json([
            'success' => true,
            'data' => $category
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $category = $this->categoryRepository->find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|string',
            'active' => 'nullable|boolean',
        ]);
        
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        
        $this->categoryRepository->update($validated, $id);
        
        return response()->json([
            'success' => true,
            'data' => $this->categoryRepository->find($id)
        ]);
    }

    public function destroy($id)
    {
        $category = $this->categoryRepository->find($id);
        
        if (!$category) {
            return response()->json([
                'success' => false,
                'message' => 'Category not found'
            ], 404);
        }
        
        $this->categoryRepository->delete($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Category deleted successfully'
        ]);
    }
}
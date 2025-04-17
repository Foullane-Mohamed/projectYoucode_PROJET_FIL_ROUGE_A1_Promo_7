<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\CategoryRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    protected $categoryRepository;

    public function __construct(CategoryRepository $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function index()
    {
        $categories = $this->categoryRepository->all();
        return response()->json(['data' => $categories]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = $this->categoryRepository->create($request->all());
        return response()->json(['message' => 'Category created successfully', 'data' => $category], 201);
    }

    public function show($id)
    {
        $category = $this->categoryRepository->find($id);
        return response()->json(['data' => $category]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = $this->categoryRepository->update($request->all(), $id);
        return response()->json(['message' => 'Category updated successfully', 'data' => $category]);
    }

    public function destroy($id)
    {
        $this->categoryRepository->delete($id);
        return response()->json(['message' => 'Category deleted successfully']);
    }

    public function getParentCategories()
    {
        $categories = $this->categoryRepository->getParentCategories();
        return response()->json(['data' => $categories]);
    }

    public function getCategoryWithSubcategories($id)
    {
        $category = $this->categoryRepository->getCategoryWithSubcategories($id);
        return response()->json(['data' => $category]);
    }
}
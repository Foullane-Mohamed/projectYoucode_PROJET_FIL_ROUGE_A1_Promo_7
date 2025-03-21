<?php

namespace App\Http\Controllers;

use App\Http\Requests\SubCategoryRequest;
use App\Services\SubCategoryService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class SubCategoryController extends Controller
{
    protected $subCategoryService;

    public function __construct(SubCategoryService $subCategoryService)
    {
        $this->subCategoryService = $subCategoryService;
    }

    /**
     * Display a listing of the subcategories.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $subcategories = $this->subCategoryService->getAllSubCategories(['category']);
            return response()->json([
                'status' => 'success',
                'data' => $subcategories
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created subcategory in storage.
     *
     * @param  \App\Http\Requests\SubCategoryRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(SubCategoryRequest $request)
    {
        try {
            $subcategory = $this->subCategoryService->createSubCategory($request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'SubCategory created successfully',
                'data' => $subcategory
            ], Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified subcategory.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $subcategory = $this->subCategoryService->getSubCategoryById($id, ['category', 'products']);
            return response()->json([
                'status' => 'success',
                'data' => $subcategory
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified subcategory in storage.
     *
     * @param  \App\Http\Requests\SubCategoryRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(SubCategoryRequest $request, $id)
    {
        try {
            $subcategory = $this->subCategoryService->updateSubCategory($id, $request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'SubCategory updated successfully',
                'data' => $subcategory
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified subcategory from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $this->subCategoryService->deleteSubCategory($id);
            return response()->json([
                'status' => 'success',
                'message' => 'SubCategory deleted successfully'
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get subcategories by category.
     *
     * @param  int  $categoryId
     * @return \Illuminate\Http\Response
     */
    public function byCategory($categoryId)
    {
        try {
            $subcategories = $this->subCategoryService->getSubCategoriesByCategory($categoryId);
            return response()->json([
                'status' => 'success',
                'data' => $subcategories
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get subcategories with products.
     *
     * @return \Illuminate\Http\Response
     */
    public function withProducts()
    {
        try {
            $subcategories = $this->subCategoryService->getSubCategoriesWithProducts();
            return response()->json([
                'status' => 'success',
                'data' => $subcategories
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
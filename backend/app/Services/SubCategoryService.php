<?php

namespace App\Services;

use App\Repositories\Interfaces\SubCategoryRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SubCategoryService
{
    protected $subCategoryRepository;

    public function __construct(SubCategoryRepositoryInterface $subCategoryRepository)
    {
        $this->subCategoryRepository = $subCategoryRepository;
    }

    public function getAllSubCategories(array $relations = [])
    {
        return $this->subCategoryRepository->all(['*'], $relations);
    }

    public function getSubCategoryById(int $id, array $relations = [])
    {
        return $this->subCategoryRepository->findById($id, ['*'], $relations);
    }

    public function createSubCategory(array $attributes)
    {
        try {
            // Handle image upload if present
            if (isset($attributes['image']) && $attributes['image']) {
                $attributes['image'] = $this->uploadImage($attributes['image']);
            }

            return $this->subCategoryRepository->create($attributes);
        } catch (Exception $e) {
            Log::error('Error creating subcategory: ' . $e->getMessage());
            throw new Exception('Unable to create subcategory: ' . $e->getMessage());
        }
    }

    public function updateSubCategory(int $id, array $attributes)
    {
        try {
            $subcategory = $this->subCategoryRepository->findById($id);

            // Handle image upload if present
            if (isset($attributes['image']) && $attributes['image']) {
                // Delete old image if exists
                if ($subcategory->image) {
                    Storage::delete('public/subcategories/' . $subcategory->image);
                }
                $attributes['image'] = $this->uploadImage($attributes['image']);
            }

            return $this->subCategoryRepository->update($id, $attributes);
        } catch (Exception $e) {
            Log::error('Error updating subcategory: ' . $e->getMessage());
            throw new Exception('Unable to update subcategory: ' . $e->getMessage());
        }
    }

    public function deleteSubCategory(int $id)
    {
        try {
            $subcategory = $this->subCategoryRepository->findById($id);

            // Delete image if exists
            if ($subcategory->image) {
                Storage::delete('public/subcategories/' . $subcategory->image);
            }

            return $this->subCategoryRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error deleting subcategory: ' . $e->getMessage());
            throw new Exception('Unable to delete subcategory: ' . $e->getMessage());
        }
    }

    public function getSubCategoriesByCategory(int $categoryId)
    {
        return $this->subCategoryRepository->findByCategory($categoryId);
    }

    public function getSubCategoriesWithProducts()
    {
        return $this->subCategoryRepository->findWithProducts();
    }

    protected function uploadImage($image)
    {
        $filename = time() . '.' . $image->getClientOriginalExtension();
        $image->storeAs('public/subcategories', $filename);
        return $filename;
    }
}
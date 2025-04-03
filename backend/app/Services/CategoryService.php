<?php

namespace App\Services;

use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class CategoryService
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getAllCategories(array $relations = [])
    {
        return $this->categoryRepository->all(['*'], $relations);
    }

    public function getCategoryById(int $id, array $relations = [])
    {
        return $this->categoryRepository->findById($id, ['*'], $relations);
    }

    public function createCategory(array $attributes)
    {
        try {
<<<<<<< HEAD
=======
            // Handle image upload if present
>>>>>>> ce810818542af5206cba22329376163b0ab7a46e
            if (isset($attributes['image']) && $attributes['image']) {
                $attributes['image'] = $this->uploadImage($attributes['image']);
            }

            return $this->categoryRepository->create($attributes);
        } catch (Exception $e) {
            Log::error('Error creating category: ' . $e->getMessage());
            throw new Exception('Unable to create category: ' . $e->getMessage());
        }
    }

    public function updateCategory(int $id, array $attributes)
    {
        try {
            $category = $this->categoryRepository->findById($id);

<<<<<<< HEAD
            
            if (isset($attributes['image']) && $attributes['image']) {
              
=======
            // Handle image upload if present
            if (isset($attributes['image']) && $attributes['image']) {
                // Delete old image if exists
>>>>>>> ce810818542af5206cba22329376163b0ab7a46e
                if ($category->image) {
                    Storage::delete('public/categories/' . $category->image);
                }
                $attributes['image'] = $this->uploadImage($attributes['image']);
            }

            return $this->categoryRepository->update($id, $attributes);
        } catch (Exception $e) {
            Log::error('Error updating category: ' . $e->getMessage());
            throw new Exception('Unable to update category: ' . $e->getMessage());
        }
    }

    public function deleteCategory(int $id)
    {
        try {
            $category = $this->categoryRepository->findById($id);

            // Delete image if exists
            if ($category->image) {
                Storage::delete('public/categories/' . $category->image);
            }

            return $this->categoryRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error deleting category: ' . $e->getMessage());
            throw new Exception('Unable to delete category: ' . $e->getMessage());
        }
    }

    public function getCategoriesWithSubcategories()
    {
        return $this->categoryRepository->findWithSubcategories();
    }

    protected function uploadImage($image)
    {
        $filename = time() . '.' . $image->getClientOriginalExtension();
        $image->storeAs('public/categories', $filename);
        return $filename;
    }
}
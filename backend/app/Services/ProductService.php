<?php

namespace App\Services;

use App\Repositories\Interfaces\ProductRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    protected $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function getAllProducts(array $relations = [])
    {
        return $this->productRepository->all(['*'], $relations);
    }

    public function getProductById(int $id, array $relations = [])
    {
        return $this->productRepository->findById($id, ['*'], $relations);
    }

    public function createProduct(array $attributes)
    {
        try {
            // Handle image upload if present
            if (isset($attributes['image']) && $attributes['image']) {
                $attributes['image'] = $this->uploadImage($attributes['image']);
            }

            return $this->productRepository->create($attributes);
        } catch (Exception $e) {
            Log::error('Error creating product: ' . $e->getMessage());
            throw new Exception('Unable to create product: ' . $e->getMessage());
        }
    }

    public function updateProduct(int $id, array $attributes)
    {
        try {
            $product = $this->productRepository->findById($id);

            // Handle image upload if present
            if (isset($attributes['image']) && $attributes['image']) {
                // Delete old image if exists
                if ($product->image) {
                    Storage::delete('public/products/' . $product->image);
                }
                $attributes['image'] = $this->uploadImage($attributes['image']);
            }

            return $this->productRepository->update($id, $attributes);
        } catch (Exception $e) {
            Log::error('Error updating product: ' . $e->getMessage());
            throw new Exception('Unable to update product: ' . $e->getMessage());
        }
    }

    public function deleteProduct(int $id)
    {
        try {
            $product = $this->productRepository->findById($id);

            // Delete image if exists
            if ($product->image) {
                Storage::delete('public/products/' . $product->image);
            }

            return $this->productRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error deleting product: ' . $e->getMessage());
            throw new Exception('Unable to delete product: ' . $e->getMessage());
        }
    }

    public function searchProducts(string $term)
    {
        return $this->productRepository->searchProducts($term);
    }

    public function getLatestProducts(int $limit = 8)
    {
        return $this->productRepository->getLatestProducts($limit);
    }

    public function findProductsBySubcategory(int $subcategoryId)
    {
        return $this->productRepository->findBySubcategory($subcategoryId);
    }

    public function findProductsInPriceRange(float $min, float $max)
    {
        return $this->productRepository->findWithinPriceRange($min, $max);
    }

    public function updateProductStock(int $id, int $quantity)
    {
        return $this->productRepository->updateStock($id, $quantity);
    }

    protected function uploadImage($image)
    {
        $filename = time() . '.' . $image->getClientOriginalExtension();
        $image->storeAs('public/products', $filename);
        return $filename;
    }
}
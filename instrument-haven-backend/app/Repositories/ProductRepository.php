<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    /**
     * Set model
     */
    public function setModel()
    {
        $this->model = new Product();
    }

    /**
     * Find product by id with error handling
     * 
     * @param int $id
     * @param array $columns
     * @return mixed
     */
    public function find($id, $columns = ['*'])
    {
        try {
            // Find the product or throw ModelNotFoundException
            $product = $this->model->findOrFail($id, $columns);
            
            // Set default values for safety
            if (!isset($product->average_rating)) {
                $product->average_rating = 0;
            }
            
            // If images exist, ensure they are properly formatted
            if ($product->images) {
                // Handle different format cases
                if (is_string($product->images)) {
                    try {
                        $product->images = json_decode($product->images, true);
                    } catch (\Exception $e) {
                        \Log::warning("Failed to decode product {$id} images JSON: " . $e->getMessage());
                        $product->images = [];
                    }
                }
                
                if (is_array($product->images)) {
                    foreach ($product->images as $key => $image) {
                        if (!is_string($image)) {
                            \Log::warning("Invalid image format for product {$id}: ", ['image' => $image]);
                            unset($product->images[$key]);
                        }
                    }
                    
                    // Re-index the array after potential removals
                    $product->images = array_values(array_filter($product->images));
                } else {
                    // Set to empty array if not an array
                    $product->images = [];
                }
            }
            
            return $product;
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error("Product not found with ID: {$id}");
            throw $e;
        } catch (\Exception $e) {
            \Log::error("Error finding product {$id}: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Find products by category id
     * 
     * @param int $categoryId
     * @return mixed
     */
    public function findByCategoryId($categoryId)
    {
        return $this->model->where('category_id', $categoryId)->get();
    }
    
    /**
     * Search products
     * 
     * @param string $term
     * @return mixed
     */
    public function search($term)
    {
        return $this->model->where('name', 'like', "%{$term}%")
            ->orWhere('description', 'like', "%{$term}%")
            ->orWhere('brand', 'like', "%{$term}%")
            ->get();
    }
    
    /**
     * Filter products
     * 
     * @param array $filters
     * @return mixed
     */
    public function filter($filters)
    {
        $query = $this->model->query();
        
        // Category filter
        if (isset($filters['category_id']) && $filters['category_id']) {
            $query->where('category_id', $filters['category_id']);
        }
        
        // Price range filter
        if (isset($filters['price_min']) && $filters['price_min']) {
            $query->where('price', '>=', $filters['price_min']);
        }
        
        if (isset($filters['price_max']) && $filters['price_max']) {
            $query->where('price', '<=', $filters['price_max']);
        }
        
        // Search filter
        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%")
                  ->orWhere('brand', 'like', "%{$filters['search']}%");
            });
        }
        
        // Sort filter
        if (isset($filters['sort_by']) && $filters['sort_by']) {
            $direction = isset($filters['sort_direction']) && $filters['sort_direction'] === 'desc' ? 'desc' : 'asc';
            $query->orderBy($filters['sort_by'], $direction);
        } else {
            $query->orderBy('created_at', 'desc');
        }
        
        // Get paginated results
        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 15;
        
        return $query->paginate($perPage);
    }
}
<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Services\Interfaces\ProductServiceInterface;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    protected $productService;


    public function __construct(ProductServiceInterface $productService)
    {
        parent::__construct();
        $this->productService = $productService;
    }


    public function setModel()
    {
        $this->model = new Product();
    }


    public function find($id, $columns = ['*'])
    {
        try {

            $product = $this->model->findOrFail($id, $columns);
            
            if (!isset($product->average_rating)) {
                $product->average_rating = 0;
            }
            
            if ($product->images) {
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
                    
                    $product->images = array_values(array_filter($product->images));
                } else {
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


    public function findByCategoryId($categoryId)
    {
        return $this->model->where('category_id', $categoryId)->get();
    }
    

    public function search($term)
    {
        return $this->model->where('name', 'like', "%{$term}%")
            ->orWhere('description', 'like', "%{$term}%")
            ->orWhere('brand', 'like', "%{$term}%")
            ->get();
    }
    

    public function filter($filters)
    {
        $query = $this->model->query();
        
        if (isset($filters['category_id']) && $filters['category_id']) {
            $query->where('category_id', $filters['category_id']);
        }
        
        if (isset($filters['price_min']) && $filters['price_min']) {
            $query->where('price', '>=', $filters['price_min']);
        }
        
        if (isset($filters['price_max']) && $filters['price_max']) {
            $query->where('price', '<=', $filters['price_max']);
        }
        
        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%")
                  ->orWhere('brand', 'like', "%{$filters['search']}%");
            });
        }
        
        if (isset($filters['sort_by']) && $filters['sort_by']) {
            $direction = isset($filters['sort_direction']) && $filters['sort_direction'] === 'desc' ? 'desc' : 'asc';
            $query->orderBy($filters['sort_by'], $direction);
        } else {
            $query->orderBy('created_at', 'desc');
        }
        
        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 15;
        
        return $query->paginate($perPage);
    }
}

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

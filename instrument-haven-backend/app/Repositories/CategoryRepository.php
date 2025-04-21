<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    /**
     * Set model
     */
    public function setModel()
    {
        $this->model = new Category();
    }

    /**
     * Get root categories
     * 
     * @return mixed
     */
    public function getRootCategories()
    {
        return $this->model->whereNull('parent_id')->get();
    }
    
    /**
     * Get category with its products
     * 
     * @param int $id
     * @return mixed
     */
    public function getCategoryWithProducts($id)
    {
        return $this->model->with('products')->findOrFail($id);
    }
    
    /**
     * Get paginated categories with filters
     * 
     * @param int $perPage
     * @param array $filters
     * @param string $orderBy
     * @param string $direction
     * @return mixed
     */
    public function paginateWithFilters($perPage = 15, array $filters = [], $orderBy = 'id', $direction = 'asc')
    {
        $query = $this->model->query();
        
        // Apply search filter
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        // Apply ordering
        $query->orderBy($orderBy, $direction);
        
        return $query->paginate($perPage);
    }
}

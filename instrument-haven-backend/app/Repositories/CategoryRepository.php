<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Services\Interfaces\CategoryServiceInterface;
use Illuminate\Database\Eloquent\Builder;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    protected $categoryService;


    public function __construct(CategoryServiceInterface $categoryService)
    {
        parent::__construct();
        $this->categoryService = $categoryService;
    }


    public function setModel()
    {
        $this->model = new Category();
    }
    
  
    public function getCategoryWithProducts($id)
    {
        return $this->model->with('products')->findOrFail($id);
    }

    public function paginateWithFilters($perPage = 15, array $filters = [], $orderBy = 'id', $direction = 'asc')
    {
        $query = $this->model->query();
        

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
    
        $query->orderBy($orderBy, $direction);
        
        return $query->paginate($perPage);
    }
}

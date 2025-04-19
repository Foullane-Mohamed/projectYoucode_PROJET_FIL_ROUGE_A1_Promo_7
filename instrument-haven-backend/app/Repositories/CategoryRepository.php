<?php

namespace App\Repositories;

use App\Models\Category;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use Illuminate\Support\Str;

class CategoryRepository extends BaseRepository implements CategoryRepositoryInterface
{
    /**
     * CategoryRepository constructor.
     *
     * @param Category $model
     */
    public function __construct(Category $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getAllWithSubcategories()
    {
        return $this->model
            ->whereNull('parent_id')
            ->with('subcategories.subcategories')
            ->orderBy('position')
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function getWithSubcategories(int $id)
    {
        return $this->model
            ->with('subcategories')
            ->find($id);
    }

    /**
     * @inheritDoc
     */
    public function findBySlug(string $slug)
    {
        return $this->model->where('slug', $slug)->first();
    }

    /**
     * @inheritDoc
     */
    public function getRootCategories()
    {
        return $this->model
            ->whereNull('parent_id')
            ->orderBy('position')
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function getSubcategories(int $categoryId)
    {
        return $this->model
            ->where('parent_id', $categoryId)
            ->orderBy('position')
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function create(array $data)
    {
        // Generate slug if not provided
        if (!isset($data['slug']) || empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
            
            // Check for uniqueness
            $count = 0;
            $slug = $data['slug'];
            while ($this->model->where('slug', $slug)->exists()) {
                $count++;
                $slug = $data['slug'] . '-' . $count;
            }
            $data['slug'] = $slug;
        }
        
        // Handle image
        if (isset($data['image']) && !empty($data['image'])) {
            // Image handling logic would go here
            // In a real app, we'd process and store the image
        }
        
        return parent::create($data);
    }

    /**
     * @inheritDoc
     */
    public function update(array $data, int $id)
    {
        $category = $this->model->find($id);
        
        if (!$category) {
            return false;
        }
        
        // Generate slug if name changed and slug not provided
        if (isset($data['name']) && $data['name'] !== $category->name && (!isset($data['slug']) || empty($data['slug']))) {
            $data['slug'] = Str::slug($data['name']);
            
            // Check for uniqueness
            $count = 0;
            $slug = $data['slug'];
            while ($this->model->where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $count++;
                $slug = $data['slug'] . '-' . $count;
            }
            $data['slug'] = $slug;
        }
        
        // Handle image
        if (isset($data['image']) && !empty($data['image'])) {
            // Image handling logic would go here
        }
        
        return $category->update($data);
    }
}

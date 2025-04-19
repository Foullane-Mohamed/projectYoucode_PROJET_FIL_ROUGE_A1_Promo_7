<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    /**
     * ProductRepository constructor.
     *
     * @param Product $model
     */
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getWithFilters(array $filters, int $perPage = 15)
    {
        $query = $this->model->with('category');

        // Category filter
        if (isset($filters['category_id']) && $filters['category_id']) {
            $query->where('category_id', $filters['category_id']);
        }

        // Subcategory filter (via category's parent_id)
        if (isset($filters['subcategory_id']) && $filters['subcategory_id']) {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('parent_id', $filters['subcategory_id']);
            });
        }

        // Search filter
        if (isset($filters['search']) && $filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }

        // Price range filter
        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        // Brand filter
        if (isset($filters['brand']) && is_array($filters['brand'])) {
            $query->whereIn('brand', $filters['brand']);
        }

        // Rating filter
        if (isset($filters['rating']) && is_numeric($filters['rating'])) {
            $query->whereHas('reviews', function ($q) use ($filters) {
                $q->select(DB::raw('AVG(rating) as average_rating'))
                  ->groupBy('product_id')
                  ->havingRaw('average_rating >= ?', [$filters['rating']]);
            });
        }

        // Stock availability filter
        if (isset($filters['in_stock']) && $filters['in_stock'] === 'true') {
            $query->where('stock', '>', 0);
        }

        // On sale filter
        if (isset($filters['on_sale']) && $filters['on_sale'] === 'true') {
            $query->where('on_sale', true);
        }

        // Attribute filters
        if (isset($filters['attribute']) && is_array($filters['attribute'])) {
            foreach ($filters['attribute'] as $attribute => $values) {
                if (is_array($values) && !empty($values)) {
                    $query->where(function ($q) use ($attribute, $values) {
                        foreach ($values as $value) {
                            $q->orWhereJsonContains("attributes->{$attribute}", $value);
                        }
                    });
                }
            }
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        
        $allowedSortFields = ['name', 'price', 'created_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Active products only
        $query->where('is_active', true);

        return $query->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function getWithDetails(int $id)
    {
        return $this->model->with(['category', 'reviews' => function ($query) {
            $query->with('user:id,name')->latest()->take(5);
        }])->find($id);
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
    public function search(string $term)
    {
        return $this->model->where('name', 'like', "%{$term}%")
            ->orWhere('description', 'like', "%{$term}%")
            ->where('is_active', true)
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function getReviews(int $productId, array $filters = [], int $perPage = 10)
    {
        $product = $this->model->find($productId);
        
        if (!$product) {
            return null;
        }
        
        $reviewsQuery = $product->reviews()->with('user:id,name');
        
        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        
        $allowedSortFields = ['rating', 'created_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $reviewsQuery->orderBy($sortBy, $sortDirection);
        } else {
            $reviewsQuery->orderBy('created_at', 'desc');
        }
        
        $reviews = $reviewsQuery->paginate($perPage);
        
        // Add review summary
        $summary = [
            'average_rating' => $product->reviews()->avg('rating') ?: 0,
            'count' => $product->reviews()->count(),
            'rating_distribution' => [
                '5' => $product->reviews()->where('rating', 5)->count(),
                '4' => $product->reviews()->where('rating', 4)->count(),
                '3' => $product->reviews()->where('rating', 3)->count(),
                '2' => $product->reviews()->where('rating', 2)->count(),
                '1' => $product->reviews()->where('rating', 1)->count(),
            ]
        ];
        
        $reviews->summary = $summary;
        
        return $reviews;
    }

    /**
     * @inheritDoc
     */
    public function updateStock(int $productId, int $quantity, bool $increment = false)
    {
        $product = $this->model->find($productId);
        
        if (!$product) {
            return false;
        }
        
        if ($increment) {
            $product->stock += $quantity;
        } else {
            $product->stock = max(0, $product->stock - $quantity);
        }
        
        return $product->save();
    }

    /**
     * @inheritDoc
     */
    public function getTopSelling(int $limit = 5)
    {
        return $this->model
            ->select('products.*', DB::raw('SUM(order_items.quantity) as total_sold'))
            ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
            ->groupBy('products.id')
            ->orderBy('total_sold', 'desc')
            ->take($limit)
            ->get();
    }

    /**
     * @inheritDoc
     */
    public function getLowStock(int $threshold = 5, int $limit = 10)
    {
        return $this->model
            ->where('stock', '<=', $threshold)
            ->where('stock', '>', 0)
            ->where('is_active', true)
            ->take($limit)
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
        
        // Handle images
        $uploadedImages = [];
        if (isset($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $image) {
                if (is_string($image) && strpos($image, 'data:image') === 0) {
                    // This is a base64 encoded image
                    $extension = $this->getImageExtension($image);
                    $imageName = 'products/' . Str::random(20) . '.' . $extension;
                    $imageData = $this->getBase64ImageData($image);
                    
                    // Store the image
                    if (\Illuminate\Support\Facades\Storage::disk('public')->put($imageName, base64_decode($imageData))) {
                        $uploadedImages[] = $imageName;
                    }
                } elseif (is_file($image)) {
                    // Handle uploaded file if needed
                }
            }
            
            if (!empty($uploadedImages)) {
                $data['images'] = $uploadedImages;
            }
        }
        
        // Set default values if not provided
        $data['is_active'] = $data['is_active'] ?? true;
        $data['on_sale'] = $data['on_sale'] ?? false;
        $data['specifications'] = $data['specifications'] ?? null;
        $data['attributes'] = $data['attributes'] ?? null;
        
        $product = parent::create($data);
        
        return $product;
    }

    /**
     * @inheritDoc
     */
    public function update(int $id, array $data)
    {
        $product = $this->model->find($id);
        
        if (!$product) {
            return false;
        }
        
        // Generate slug if name changed and slug not provided
        if (isset($data['name']) && $data['name'] !== $product->name && (!isset($data['slug']) || empty($data['slug']))) {
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
        
        // Handle images
        $uploadedImages = [];
        if (isset($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $image) {
                if (is_string($image) && strpos($image, 'data:image') === 0) {
                    // This is a base64 encoded image
                    $extension = $this->getImageExtension($image);
                    $imageName = 'products/' . Str::random(20) . '.' . $extension;
                    $imageData = $this->getBase64ImageData($image);
                    
                    // Store the image
                    if (\Illuminate\Support\Facades\Storage::disk('public')->put($imageName, base64_decode($imageData))) {
                        $uploadedImages[] = $imageName;
                    }
                } elseif (is_file($image)) {
                    // Handle uploaded file if needed
                }
            }
            
            // Replace or append images
            if (!empty($uploadedImages)) {
                if (isset($data['replace_images']) && $data['replace_images']) {
                    $data['images'] = $uploadedImages;
                } else {
                    $currentImages = $product->images ?? [];
                    $data['images'] = array_merge($currentImages, $uploadedImages);
                }
            }
        }
        
        // Remove images
        if (isset($data['remove_images']) && is_array($data['remove_images'])) {
            $currentImages = $product->images ?? [];
            $updatedImages = array_filter($currentImages, function ($key) use ($data) {
                return !in_array($key, $data['remove_images']);
            }, ARRAY_FILTER_USE_KEY);
            
            $data['images'] = $updatedImages;
        }
        
        return $product->update($data);
    }
    
    /**
     * Get image extension from base64 string
     *
     * @param string $base64String
     * @return string
     */
    private function getImageExtension($base64String)
    {
        if (preg_match('/data:image\/(.*?);base64,/i', $base64String, $matches)) {
            return $matches[1];
        }
        
        return 'jpg';
    }
    
    /**
     * Get base64 data from base64 string
     *
     * @param string $base64String
     * @return string
     */
    private function getBase64ImageData($base64String)
    {
        if (preg_match('/data:image\/.*?;base64,(.*)/i', $base64String, $matches)) {
            return $matches[1];
        }
        
        return '';
    }
}

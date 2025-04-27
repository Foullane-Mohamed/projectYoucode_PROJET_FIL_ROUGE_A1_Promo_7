<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'sale_price',
        'on_sale',
        'stock',
        'category_id',
        'brand',
        'thumbnail',
        'images',
        'is_active',
        'specifications',
        'attributes'
    ];

    protected $casts = [
        'price' => 'float',
        'sale_price' => 'float',
        'on_sale' => 'boolean',
        'stock' => 'integer',
        'is_active' => 'boolean',
        'images' => 'array',
        'specifications' => 'array',
        'attributes' => 'array'
    ];

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the reviews for the product.
     */
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Return the product image URL
     * 
     * @return string
     */
    public function getImageUrlAttribute()
    {
        if ($this->thumbnail) {
            // Return just the filename without the path prefix
            // This will allow the frontend to construct the full path
            $filename = basename($this->thumbnail);
            return $filename;
        }
        
        return null;
    }
    
    /**
     * Return all product image URLs
     * 
     * @return array
     */
    public function getImageUrlsAttribute()
    {
        if ($this->images && is_array($this->images)) {
            return array_map(function($image) {
                // Return just the filename without the path prefix
                return basename($image);
            }, $this->images);
        }
        
        return [];
    }
    
    /**
     * Calculate the average rating for the product
     * 
     * @return float
     */
    public function getAverageRatingAttribute()
    {
        try {
            if (!$this->relationLoaded('reviews')) {
                $this->load('reviews');
            }
            
            $reviewsCount = $this->reviews->count();
            if ($reviewsCount === 0) {
                return 0;
            }
            
            $sum = $this->reviews->sum('rating');
            return round($sum / $reviewsCount, 1);
        } catch (\Exception $e) {
            \Log::error('Error calculating average rating: ' . $e->getMessage());
            return 0;
        }
    }
}
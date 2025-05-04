<?php

namespace App\Models;

use App\Services\Interfaces\ProductServiceInterface;
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

  
    public function category()
    {
        return $this->belongsTo(Category::class);
    }


    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
  
  
    public function getImageUrlAttribute()
    {
        return app(ProductServiceInterface::class)->getImageUrl($this);
    }
    

    public function getImageUrlsAttribute()
    {
        return app(ProductServiceInterface::class)->getImageUrls($this);
    }

  
    public function getAverageRatingAttribute()
    {
        return app(ProductServiceInterface::class)->calculateAverageRating($this);
    }
}

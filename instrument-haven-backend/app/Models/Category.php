<?php

namespace App\Models;

use App\Services\Interfaces\CategoryServiceInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'image_url',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            $category->slug = app(CategoryServiceInterface::class)->generateSlug($category->name, $category->slug);
        });

        static::updating(function ($category) {
            $category->slug = app(CategoryServiceInterface::class)->generateSlug($category->name, $category->slug);
        });
    }

  
    public function products()
    {
        return $this->hasMany(Product::class);
    }


    public function getProductCountAttribute()
    {
        return app(CategoryServiceInterface::class)->getProductCount($this);
    }
}

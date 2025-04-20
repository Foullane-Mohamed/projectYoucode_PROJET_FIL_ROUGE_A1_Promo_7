<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Tag extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'slug',
    ];

    /**
     * Boot function to set the slug
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($tag) {
            $tag->slug = $tag->slug ?? Str::slug($tag->name);
        });

        static::updating(function ($tag) {
            $tag->slug = $tag->slug ?? Str::slug($tag->name);
        });
    }

    /**
     * Get the products for the tag
     */
    public function products()
    {
        return $this->belongsToMany(Product::class);
    }
}

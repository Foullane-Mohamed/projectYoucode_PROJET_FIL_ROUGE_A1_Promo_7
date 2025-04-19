<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'product_id',
    ];

    /**
     * Get the user that owns the wishlist item.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that belongs to the wishlist item.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the product name.
     */
    public function getProductNameAttribute()
    {
        return $this->product->name;
    }

    /**
     * Get the product price.
     */
    public function getPriceAttribute()
    {
        return $this->product->price;
    }

    /**
     * Get the product thumbnail.
     */
    public function getThumbnailAttribute()
    {
        return $this->product->thumbnail;
    }

    /**
     * Check if the product is in stock.
     */
    public function getInStockAttribute()
    {
        return $this->product->inStock();
    }

    /**
     * Get the date when the item was added to the wishlist.
     */
    public function getAddedAtAttribute()
    {
        return $this->created_at;
    }
}

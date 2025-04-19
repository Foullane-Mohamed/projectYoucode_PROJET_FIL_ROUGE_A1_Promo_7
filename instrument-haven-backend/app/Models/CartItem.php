<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'quantity' => 'integer',
    ];

    /**
     * Get the cart that owns the item.
     */
    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }

    /**
     * Get the product associated with the cart item.
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
     * Get the product thumbnail.
     */
    public function getThumbnailAttribute()
    {
        return $this->product->thumbnail;
    }

    /**
     * Calculate the subtotal.
     */
    protected static function booted()
    {
        static::creating(function ($cartItem) {
            $cartItem->subtotal = $cartItem->unit_price * $cartItem->quantity;
        });

        static::updating(function ($cartItem) {
            $cartItem->subtotal = $cartItem->unit_price * $cartItem->quantity;
        });

        static::saved(function ($cartItem) {
            $cartItem->cart->recalculate();
        });

        static::deleted(function ($cartItem) {
            $cartItem->cart->recalculate();
        });
    }
}

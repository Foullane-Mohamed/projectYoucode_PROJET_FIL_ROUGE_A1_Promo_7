<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'discount_type',
        'discount_value',
        'min_order_amount',
        'max_discount_amount',
        'starts_at',
        'expires_at',
        'is_active',
        'usage_limit',
        'usage_count',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'discount_value' => 'float',
        'min_order_amount' => 'float',
        'max_discount_amount' => 'float',
        'is_active' => 'boolean',
        'usage_limit' => 'integer',
        'usage_count' => 'integer',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the carts that belong to the coupon
     */
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    /**
     * Check if coupon is valid
     */
    public function isValid($subtotal = null)
    {
        // Check if coupon is active
        if (!$this->is_active) {
            return false;
        }
        
        // Check if coupon has expired
        if ($this->starts_at > now() || $this->expires_at < now()) {
            return false;
        }
        
        // Check if usage limit has been reached
        if ($this->usage_limit && $this->usage_count >= $this->usage_limit) {
            return false;
        }
        
        // Check if minimum order amount is reached
        if ($subtotal !== null && $this->min_order_amount && $subtotal < $this->min_order_amount) {
            return false;
        }
        
        return true;
    }
}

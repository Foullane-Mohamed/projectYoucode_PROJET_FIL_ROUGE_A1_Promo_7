<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

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
        'discount',
        'type',
        'min_purchase',
        'start_date',
        'end_date',
        'usage_limit',
        'usage_count',
        'description',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'discount' => 'decimal:2',
        'min_purchase' => 'decimal:2',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'usage_limit' => 'integer',
        'usage_count' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the orders that used this coupon.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Check if the coupon is valid for the cart.
     *
     * @param Cart $cart
     * @return bool
     */
    public function isValidForCart(Cart $cart)
    {
        // Check if coupon is active
        if (!$this->is_active) {
            return false;
        }

        // Check if coupon has started
        if ($this->start_date && $this->start_date->isFuture()) {
            return false;
        }

        // Check if coupon has expired
        if ($this->end_date && $this->end_date->isPast()) {
            return false;
        }

        // Check if coupon has reached usage limit
        if ($this->usage_limit > 0 && $this->usage_count >= $this->usage_limit) {
            return false;
        }

        // Check if cart meets minimum purchase requirement
        if ($this->min_purchase > 0 && $cart->subtotal < $this->min_purchase) {
            return false;
        }

        return true;
    }

    /**
     * Calculate the discount amount for a cart.
     *
     * @param Cart $cart
     * @return float
     */
    public function calculateDiscountForCart(Cart $cart)
    {
        if ($this->type === 'percentage') {
            return round(($cart->subtotal * $this->discount) / 100, 2);
        }

        return min($this->discount, $cart->subtotal);
    }

    /**
     * Get the coupon status (active, expired, upcoming).
     */
    public function getStatusAttribute()
    {
        if (!$this->is_active) {
            return 'inactive';
        }

        $now = Carbon::now();
        
        if ($this->start_date && $this->start_date->isFuture()) {
            return 'upcoming';
        }
        
        if ($this->end_date && $this->end_date->isPast()) {
            return 'expired';
        }
        
        if ($this->usage_limit > 0 && $this->usage_count >= $this->usage_limit) {
            return 'depleted';
        }
        
        return 'active';
    }
}

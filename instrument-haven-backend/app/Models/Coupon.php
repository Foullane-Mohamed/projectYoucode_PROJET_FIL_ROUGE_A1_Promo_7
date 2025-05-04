<?php

namespace App\Models;

use App\Services\Interfaces\CouponServiceInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

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

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }


    public function isValid($subtotal = null)
    {
        return app(CouponServiceInterface::class)->isValid($this, $subtotal);
    }
}

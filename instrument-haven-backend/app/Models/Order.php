<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    protected $with = ['user'];

    protected $fillable = [
        'user_id',
        'order_number',
        'status',
        'payment_method',
        'payment_status',
        'payment_id',
        'subtotal',
        'discount',
        'coupon_code',
        'tax',
        'shipping_cost',
        'total',
        'shipping_address',
        'billing_address',
        'tracking_number',
    ];

    protected $casts = [
        'subtotal' => 'float',
        'discount' => 'float',
        'tax' => 'float',
        'shipping_cost' => 'float',
        'total' => 'float',
        'shipping_address' => 'array',
        'billing_address' => 'array',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }
  
  
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
  
  
    public function getItemsCountAttribute()
    {
        return $this->items->sum('quantity');
    }
}

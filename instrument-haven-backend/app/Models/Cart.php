<?php

namespace App\Models;

use App\Services\Interfaces\CartServiceInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'coupon_id',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

  
    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

  
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }
    

    public function getSubtotalAttribute()
    {
        return app(CartServiceInterface::class)->calculateSubtotal($this);
    }
    

    public function getDiscountAttribute()
    {
        return app(CartServiceInterface::class)->calculateDiscount($this);
    }
    
  
    public function getTotalAttribute()
    {
        return app(CartServiceInterface::class)->calculateTotal($this);
    }
}

<?php

namespace App\Models;

use App\Services\Interfaces\CartItemServiceInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CartItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'cart_id',
        'product_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'float',
    ];
  

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }


    public function product()
    {
        return $this->belongsTo(Product::class);
    }


    public function getTotalAttribute()
    {
        return app(CartItemServiceInterface::class)->calculateTotal($this);
    }
}

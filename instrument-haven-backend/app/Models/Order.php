<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    
    /**
     * The relationships that should be eager loaded.
     *
     * @var array
     */
    protected $with = ['user'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
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

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal' => 'float',
        'discount' => 'float',
        'tax' => 'float',
        'shipping_cost' => 'float',
        'total' => 'float',
        'shipping_address' => 'array',
        'billing_address' => 'array',
    ];

    /**
     * Get the user that owns the order
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the order
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the items count for the order
     */
    public function getItemsCountAttribute()
    {
        return $this->items->sum('quantity');
    }

    /**
     * Generate order number
     */
    public static function generateOrderNumber()
    {
        $prefix = 'ORD-';
        $number = mt_rand(100000, 999999);
        
        while (self::where('order_number', $prefix . $number)->exists()) {
            $number = mt_rand(100000, 999999);
        }
        
        return $prefix . $number;
    }

    /**
     * Create order from cart
     */
    public static function createFromCart($userId, $paymentMethod, $paymentId, $shippingAddress, $billingAddress)
    {
        $user = User::findOrFail($userId);
        $cart = $user->cart;
        
        if (!$cart || $cart->items->isEmpty()) {
            throw new \Exception('Cart is empty.');
        }
        
        $order = new self([
            'user_id' => $userId,
            'order_number' => self::generateOrderNumber(),
            'status' => 'processing',
            'payment_method' => $paymentMethod,
            'payment_status' => 'paid',
            'payment_id' => $paymentId,
            'subtotal' => $cart->subtotal,
            'discount' => $cart->discount,
            'coupon_code' => $cart->coupon ? $cart->coupon->code : null,
            'tax' => $cart->subtotal * 0.06, // 6% tax
            'shipping_cost' => 10.00, // Fixed shipping cost
            'total' => $cart->total + ($cart->subtotal * 0.06) + 10.00,
            'shipping_address' => $shippingAddress,
            'billing_address' => $billingAddress,
        ]);
        
        $order->save();
        
        // Create order items
        foreach ($cart->items as $cartItem) {
            $orderItem = new OrderItem([
                'order_id' => $order->id,
                'product_id' => $cartItem->product_id,
                'product_name' => $cartItem->product->name,
                'product_slug' => $cartItem->product->slug,
                'quantity' => $cartItem->quantity,
                'price' => $cartItem->price,
                'total' => $cartItem->total,
            ]);
            
            $order->items()->save($orderItem);
            
            // Update product stock
            $product = $cartItem->product;
            $product->stock -= $cartItem->quantity;
            $product->save();
        }
        
        // Update coupon usage count if used
        if ($cart->coupon) {
            $cart->coupon->usage_count += 1;
            $cart->coupon->save();
        }
        
        // Clear cart
        $cart->items()->delete();
        $cart->coupon_id = null;
        $cart->save();
        
        return $order;
    }
}

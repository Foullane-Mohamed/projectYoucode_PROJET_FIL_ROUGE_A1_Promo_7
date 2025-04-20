<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'coupon_id',
    ];

    /**
     * Get the user that owns the cart
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the coupon for the cart
     */
    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Get the items for the cart
     */
    public function items()
    {
        return $this->hasMany(CartItem::class);
    }

    /**
     * Get the subtotal for the cart
     */
    public function getSubtotalAttribute()
    {
        return $this->items->sum('total');
    }

    /**
     * Get the discount for the cart
     */
    public function getDiscountAttribute()
    {
        if (!$this->coupon) {
            return 0;
        }

        if ($this->coupon->discount_type === 'percentage') {
            $discount = $this->subtotal * ($this->coupon->discount_value / 100);
            return $this->coupon->max_discount_amount && $discount > $this->coupon->max_discount_amount
                ? $this->coupon->max_discount_amount
                : $discount;
        }

        return $this->coupon->discount_value;
    }

    /**
     * Get the total for the cart
     */
    public function getTotalAttribute()
    {
        return max(0, $this->subtotal - $this->discount);
    }

    /**
     * Add product to cart
     */
    public function addProduct($productId, $quantity = 1)
    {
        $product = Product::findOrFail($productId);
        
        // Check if product is already in cart
        $cartItem = $this->items()->where('product_id', $productId)->first();
        
        if ($cartItem) {
            // Update quantity
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            // Create new cart item
            $cartItem = new CartItem([
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $product->on_sale && $product->sale_price ? $product->sale_price : $product->price,
            ]);
            
            $this->items()->save($cartItem);
        }
        
        return $cartItem;
    }

    /**
     * Update product quantity
     */
    public function updateProductQuantity($cartItemId, $quantity)
    {
        $cartItem = $this->items()->findOrFail($cartItemId);
        $cartItem->quantity = $quantity;
        $cartItem->save();
        
        return $cartItem;
    }

    /**
     * Remove product from cart
     */
    public function removeProduct($cartItemId)
    {
        return $this->items()->findOrFail($cartItemId)->delete();
    }

    /**
     * Apply coupon to cart
     */
    public function applyCoupon($couponCode)
    {
        $coupon = Coupon::where('code', $couponCode)
            ->where('is_active', true)
            ->whereDate('starts_at', '<=', now())
            ->whereDate('expires_at', '>=', now())
            ->first();
        
        if (!$coupon) {
            throw new \Exception('Invalid coupon code or expired coupon.');
        }
        
        if ($coupon->min_order_amount && $this->subtotal < $coupon->min_order_amount) {
            throw new \Exception('Minimum order amount not reached for this coupon.');
        }
        
        if ($coupon->usage_limit && $coupon->usage_count >= $coupon->usage_limit) {
            throw new \Exception('Coupon usage limit reached.');
        }
        
        $this->coupon_id = $coupon->id;
        $this->save();
        
        return $coupon;
    }

    /**
     * Remove coupon from cart
     */
    public function removeCoupon()
    {
        $this->coupon_id = null;
        $this->save();
        
        return true;
    }
}

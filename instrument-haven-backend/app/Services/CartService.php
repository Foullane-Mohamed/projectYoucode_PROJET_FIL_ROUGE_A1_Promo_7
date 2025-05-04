<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use App\Services\Interfaces\CartServiceInterface;
use Exception;

class CartService implements CartServiceInterface
{

    public function addProduct(Cart $cart, $productId, $quantity = 1)
    {
        $product = Product::findOrFail($productId);
        
        $cartItem = $cart->items()->where('product_id', $productId)->first();
        
        if ($cartItem) {
            $cartItem->quantity += $quantity;
            $cartItem->save();
        } else {
            $cartItem = new CartItem([
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $product->on_sale && $product->sale_price ? $product->sale_price : $product->price,
            ]);
            
            $cart->items()->save($cartItem);
        }
        
        return $cartItem;
    }


    public function updateProductQuantity(Cart $cart, $cartItemId, $quantity)
    {
        $cartItem = $cart->items()->findOrFail($cartItemId);
        $cartItem->quantity = $quantity;
        $cartItem->save();
        
        return $cartItem;
    }
  

    public function removeProduct(Cart $cart, $cartItemId)
    {
        return $cart->items()->findOrFail($cartItemId)->delete();
    }

    public function applyCoupon(Cart $cart, $couponCode)
    {
        $coupon = Coupon::where('code', $couponCode)
            ->where('is_active', true)
            ->whereDate('starts_at', '<=', now())
            ->whereDate('expires_at', '>=', now())
            ->first();
        
        if (!$coupon) {
            throw new Exception('Invalid coupon code or expired coupon.');
        }
        
        if ($coupon->min_order_amount && $cart->subtotal < $coupon->min_order_amount) {
            throw new Exception('Minimum order amount not reached for this coupon.');
        }
        
        if ($coupon->usage_limit && $coupon->usage_count >= $coupon->usage_limit) {
            throw new Exception('Coupon usage limit reached.');
        }
        
        $cart->coupon_id = $coupon->id;
        $cart->save();
        
        return $coupon;
    }
  
  
    public function removeCoupon(Cart $cart)
    {
        $cart->coupon_id = null;
        $cart->save();
        
        return true;
    }


    public function calculateSubtotal(Cart $cart)
    {
        return $cart->items->sum('total');
    }


    public function calculateDiscount(Cart $cart)
    {
        if (!$cart->coupon) {
            return 0;
        }

        if ($cart->coupon->discount_type === 'percentage') {
            $discount = $cart->subtotal * ($cart->coupon->discount_value / 100);
            return $cart->coupon->max_discount_amount && $discount > $cart->coupon->max_discount_amount
                ? $cart->coupon->max_discount_amount
                : $discount;
        }

        return $cart->coupon->discount_value;
    }


    public function calculateTotal(Cart $cart)
    {
        return max(0, $cart->subtotal - $cart->discount);
    }
}

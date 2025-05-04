<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Services\Interfaces\OrderServiceInterface;
use Exception;

class OrderService implements OrderServiceInterface
{

    public function generateOrderNumber()
    {
        $prefix = 'ORD-';
        $number = mt_rand(100000, 999999);
        
        while (Order::where('order_number', $prefix . $number)->exists()) {
            $number = mt_rand(100000, 999999);
        }
        
        return $prefix . $number;
    }


    public function createFromCart($userId, $paymentMethod, $paymentId, $shippingAddress, $billingAddress, $taxRate = 0.06, $shippingCost = 10.00)
    {
        $user = User::findOrFail($userId);
        $cart = $user->cart;
        
        if (!$cart || $cart->items->isEmpty()) {
            throw new Exception('Cart is empty.');
        }
        
        $order = new Order([
            'user_id' => $userId,
            'order_number' => $this->generateOrderNumber(),
            'status' => 'processing',
            'payment_method' => $paymentMethod,
            'payment_status' => 'paid',
            'payment_id' => $paymentId,
            'subtotal' => $cart->subtotal,
            'discount' => $cart->discount,
            'coupon_code' => $cart->coupon ? $cart->coupon->code : null,
            'tax' => $cart->subtotal * $taxRate,
            'shipping_cost' => $shippingCost,
            'total' => $cart->total + ($cart->subtotal * $taxRate) + $shippingCost,
            'shipping_address' => $shippingAddress,
            'billing_address' => $billingAddress,
        ]);
        
        $order->save();
        
  
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
            

            $product = $cartItem->product;
            $product->stock -= $cartItem->quantity;
            $product->save();
        }

        if ($cart->coupon) {
            $cart->coupon->usage_count += 1;
            $cart->coupon->save();
        }
        

        $cart->items()->delete();
        $cart->coupon_id = null;
        $cart->save();
        
        return $order;
    }
}

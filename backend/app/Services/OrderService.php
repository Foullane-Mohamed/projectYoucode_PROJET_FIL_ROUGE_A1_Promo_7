<?php

namespace App\Services;

use App\Repositories\Interfaces\CartRepositoryInterface;
use App\Repositories\Interfaces\CouponRepositoryInterface;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService
{
    protected $orderRepository;
    protected $productRepository;
    protected $cartRepository;
    protected $couponRepository;

    public function __construct(
        OrderRepositoryInterface $orderRepository,
        ProductRepositoryInterface $productRepository,
        CartRepositoryInterface $cartRepository,
        CouponRepositoryInterface $couponRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->cartRepository = $cartRepository;
        $this->couponRepository = $couponRepository;
    }

    public function getAllOrders()
    {
        return $this->orderRepository->all(['*'], ['user', 'products', 'paymentMethod', 'coupon']);
    }

    public function getOrderById(int $id)
    {
        return $this->orderRepository->findById($id, ['*'], ['user', 'products', 'paymentMethod', 'coupon']);
    }

    public function getOrdersByUser(int $userId)
    {
        return $this->orderRepository->findByUser($userId);
    }

    public function createOrder(array $attributes)
    {
        try {
            DB::beginTransaction();
            
            $userId = $attributes['user_id'];
            $couponCode = $attributes['coupon_code'] ?? null;
            $couponId = null;
            
            // Get the cart items
            $cartItems = $this->cartRepository->findByUser($userId);
            
            if ($cartItems->isEmpty()) {
                throw new Exception('Cart is empty.');
            }
            
            // Calculate total
            $total = 0;
            foreach ($cartItems as $item) {
                $product = $this->productRepository->findById($item->product_id);
                $total += $product->price * $item->quantity;
                
                // Check stock
                if ($product->stock < $item->quantity) {
                    throw new Exception("Not enough stock available for {$product->name}.");
                }
                
                // Update stock
                $this->productRepository->updateStock(
                    $product->id, 
                    $product->stock - $item->quantity
                );
            }
            
            // Apply coupon if provided
            if ($couponCode) {
                $coupon = $this->couponRepository->validateCoupon($couponCode);
                
                if ($coupon) {
                    $couponId = $coupon->id;
                    
                    // Apply discount
                    if ($coupon->type === 'percentage') {
                        $total = $total - ($total * $coupon->discount / 100);
                    } else if ($coupon->type === 'fixed') {
                        $total = $total - $coupon->discount;
                    }
                    
                    // Make sure total is not negative
                    $total = max(0, $total);
                }
            }
            
            // Create the order
            $orderData = [
                'user_id' => $userId,
                'total' => $total,
                'status' => 'pending',
                'payment_method_id' => $attributes['payment_method_id'] ?? null,
                'coupon_id' => $couponId,
                'shipping_address' => $attributes['shipping_address'] ?? null,
                'billing_address' => $attributes['billing_address'] ?? null,
            ];
            
            $order = $this->orderRepository->create($orderData);
            
            // Attach products to order
            foreach ($cartItems as $item) {
                $product = $this->productRepository->findById($item->product_id);
                $order->products()->attach($item->product_id, [
                    'quantity' => $item->quantity,
                    'price' => $product->price
                ]);
            }
            
            // Clear the cart
            $this->cartRepository->clearCart($userId);
            
            DB::commit();
            return $order;
        } catch (Exception $e) {
            DB::rollBack();
            Log::error('Error creating order: ' . $e->getMessage());
            throw new Exception('Unable to create order: ' . $e->getMessage());
        }
    }

    public function updateOrderStatus(int $id, string $status)
    {
        try {
            return $this->orderRepository->updateOrderStatus($id, $status);
        } catch (Exception $e) {
            Log::error('Error updating order status: ' . $e->getMessage());
            throw new Exception('Unable to update order status: ' . $e->getMessage());
        }
    }

    public function getOrdersByStatus(string $status)
    {
        return $this->orderRepository->findByStatus($status);
    }

    public function getMonthlyOrders(int $month, int $year)
    {
        return $this->orderRepository->getMonthlyOrders($month, $year);
    }
}
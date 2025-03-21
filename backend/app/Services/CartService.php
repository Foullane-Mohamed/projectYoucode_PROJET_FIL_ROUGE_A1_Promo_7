<?php

namespace App\Services;

use App\Repositories\Interfaces\CartRepositoryInterface;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Log;

class CartService
{
    protected $cartRepository;
    protected $productRepository;

    public function __construct(
        CartRepositoryInterface $cartRepository,
        ProductRepositoryInterface $productRepository
    ) {
        $this->cartRepository = $cartRepository;
        $this->productRepository = $productRepository;
    }

    public function getUserCart(int $userId)
    {
        try {
            $cartItems = $this->cartRepository->findByUser($userId);
            $total = $this->cartRepository->getCartTotal($userId);
            
            return [
                'items' => $cartItems,
                'total' => $total
            ];
        } catch (Exception $e) {
            Log::error('Error getting user cart: ' . $e->getMessage());
            throw new Exception('Unable to get user cart: ' . $e->getMessage());
        }
    }

    public function addToCart(int $userId, int $productId, int $quantity = 1)
    {
        try {
            // Check if product exists and has enough stock
            $product = $this->productRepository->findById($productId);
            
            if ($product->stock < $quantity) {
                throw new Exception('Not enough stock available.');
            }
            
            // Check if the product is already in the cart
            $existingItem = $this->cartRepository->findByUserAndProduct($userId, $productId);
            
            if ($existingItem) {
                // Update quantity
                $newQuantity = $existingItem->quantity + $quantity;
                
                if ($product->stock < $newQuantity) {
                    throw new Exception('Not enough stock available for the requested quantity.');
                }
                
                return $this->cartRepository->updateQuantity($userId, $productId, $newQuantity);
            } else {
                // Add new cart item
                return $this->cartRepository->create([
                    'user_id' => $userId,
                    'product_id' => $productId,
                    'quantity' => $quantity
                ]);
            }
        } catch (Exception $e) {
            Log::error('Error adding to cart: ' . $e->getMessage());
            throw new Exception('Unable to add to cart: ' . $e->getMessage());
        }
    }

    public function updateCartItemQuantity(int $userId, int $productId, int $quantity)
    {
        try {
            // Check if product exists and has enough stock
            $product = $this->productRepository->findById($productId);
            
            if ($quantity > 0 && $product->stock < $quantity) {
                throw new Exception('Not enough stock available for the requested quantity.');
            }
            
            return $this->cartRepository->updateQuantity($userId, $productId, $quantity);
        } catch (Exception $e) {
            Log::error('Error updating cart item: ' . $e->getMessage());
            throw new Exception('Unable to update cart item: ' . $e->getMessage());
        }
    }

    public function removeFromCart(int $userId, int $productId)
    {
        try {
            return $this->cartRepository->updateQuantity($userId, $productId, 0);
        } catch (Exception $e) {
            Log::error('Error removing from cart: ' . $e->getMessage());
            throw new Exception('Unable to remove from cart: ' . $e->getMessage());
        }
    }

    public function clearCart(int $userId)
    {
        try {
            return $this->cartRepository->clearCart($userId);
        } catch (Exception $e) {
            Log::error('Error clearing cart: ' . $e->getMessage());
            throw new Exception('Unable to clear cart: ' . $e->getMessage());
        }
    }
}
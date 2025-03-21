<?php

namespace App\Repositories\Interfaces;

interface CartRepositoryInterface extends BaseRepositoryInterface
{
    public function findByUser(int $userId);
    public function findByUserAndProduct(int $userId, int $productId);
    public function updateQuantity(int $userId, int $productId, int $quantity);
    public function clearCart(int $userId);
    public function getCartTotal(int $userId);
}
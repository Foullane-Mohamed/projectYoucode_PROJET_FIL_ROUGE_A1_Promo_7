<?php

namespace App\Repositories\Interfaces;

interface CartRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get cart for user
     *
     * @param int $userId
     * @return mixed
     */
    public function getForUser(int $userId);

    /**
     * Add item to cart
     *
     * @param int $userId
     * @param int $productId
     * @param int $quantity
     * @return mixed
     */
    public function addItem(int $userId, int $productId, int $quantity);

    /**
     * Update cart item quantity
     *
     * @param int $userId
     * @param int $itemId
     * @param int $quantity
     * @return mixed
     */
    public function updateItemQuantity(int $userId, int $itemId, int $quantity);

    /**
     * Remove item from cart
     *
     * @param int $userId
     * @param int $itemId
     * @return mixed
     */
    public function removeItem(int $userId, int $itemId);

    /**
     * Apply coupon to cart
     *
     * @param int $userId
     * @param string $code
     * @return mixed
     */
    public function applyCoupon(int $userId, string $code);

    /**
     * Remove coupon from cart
     *
     * @param int $userId
     * @return mixed
     */
    public function removeCoupon(int $userId);

    /**
     * Clear cart
     *
     * @param int $userId
     * @return mixed
     */
    public function clearCart(int $userId);
}

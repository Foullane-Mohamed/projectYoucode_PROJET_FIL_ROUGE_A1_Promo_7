<?php

namespace App\Repositories\Interfaces;

interface WishlistRepositoryInterface extends RepositoryInterface
{

    public function getByUserId($userId);
    

    public function addProduct($userId, $productId);

    public function removeProduct($userId, $productId);
    

    public function isProductInWishlist($userId, $productId);
}

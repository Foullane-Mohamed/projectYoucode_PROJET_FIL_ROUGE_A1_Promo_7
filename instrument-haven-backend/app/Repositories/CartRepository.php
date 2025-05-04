<?php

namespace App\Repositories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Repositories\Interfaces\CartRepositoryInterface;
use App\Services\Interfaces\CartServiceInterface;
use Illuminate\Support\Facades\DB;

class CartRepository extends BaseRepository implements CartRepositoryInterface
{
    protected $cartService;


    public function __construct(CartServiceInterface $cartService)
    {
        parent::__construct();
        $this->cartService = $cartService;
    }

  
    public function setModel()
    {
        $this->model = new Cart();
    }

    public function getByUserId($userId)
    {
        return $this->model->where('user_id', $userId)->first();
    }

    public function getWithItemsByUserId($userId)
    {
        $cart = $this->model
            ->where('user_id', $userId)
            ->with(['items.product', 'coupon'])
            ->first();
        
        if (!$cart) {
            $cart = $this->model->create(['user_id' => $userId]);
        }
        
        return $cart;
    }
    

    public function addItem($userId, $productId, $quantity)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $this->cartService->addProduct($cart, $productId, $quantity);
    }

    public function updateItemQuantity($userId, $itemId, $quantity)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $this->cartService->updateProductQuantity($cart, $itemId, $quantity);
    }
    

    public function removeItem($userId, $itemId)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $this->cartService->removeProduct($cart, $itemId);
    }

    public function applyCoupon($userId, $couponCode)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $this->cartService->applyCoupon($cart, $couponCode);
    }

    public function removeCoupon($userId)
    {
        $cart = $this->getWithItemsByUserId($userId);
        
        return $this->cartService->removeCoupon($cart);
    }
}

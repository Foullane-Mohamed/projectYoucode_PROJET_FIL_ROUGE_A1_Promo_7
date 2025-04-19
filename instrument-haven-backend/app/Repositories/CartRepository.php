<?php

namespace App\Repositories;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Product;
use App\Repositories\Interfaces\CartRepositoryInterface;
use Illuminate\Support\Facades\DB;

class CartRepository extends BaseRepository implements CartRepositoryInterface
{
    /**
     * CartRepository constructor.
     *
     * @param Cart $model
     */
    public function __construct(Cart $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getForUser(int $userId)
    {
        // Find or create cart for user
        $cart = $this->model->with('items.product')->firstOrCreate(['user_id' => $userId]);
        
        return $cart;
    }

    /**
     * @inheritDoc
     */
    public function addItem(int $userId, int $productId, int $quantity)
    {
        $cart = $this->getForUser($userId);
        $product = Product::findOrFail($productId);
        
        if (!$product->inStock() || $product->stock < $quantity) {
            throw new \Exception('Insufficient stock');
        }
        
        // Check if product is already in cart
        $existingItem = $cart->items()->where('product_id', $productId)->first();
        
        try {
            DB::beginTransaction();
            
            if ($existingItem) {
                // Update quantity
                $newQuantity = $existingItem->quantity + $quantity;
                
                if ($newQuantity > $product->stock) {
                    throw new \Exception('Insufficient stock');
                }
                
                $existingItem->quantity = $newQuantity;
                $existingItem->subtotal = $product->price * $newQuantity;
                $existingItem->save();
                
                $item = $existingItem;
            } else {
                // Add new item
                $item = CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'unit_price' => $product->price,
                    'subtotal' => $product->price * $quantity
                ]);
            }
            
            // Recalculate cart totals
            $subtotal = $cart->items()->sum('subtotal');
            $cart->subtotal = $subtotal;
            $cart->total = $subtotal - $cart->discount;
            $cart->save();
            
            DB::commit();
            
            // Load product details for response
            $item->load('product');
            
            return [
                'item' => $item,
                'cart' => [
                    'subtotal' => $cart->subtotal,
                    'discount' => $cart->discount,
                    'discount_code' => $cart->discount_code,
                    'total' => $cart->total
                ]
            ];
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @inheritDoc
     */
    public function updateItemQuantity(int $userId, int $itemId, int $quantity)
    {
        $cart = $this->getForUser($userId);
        $item = $cart->items()->findOrFail($itemId);
        $product = $item->product;
        
        if ($quantity <= 0) {
            return $this->removeItem($userId, $itemId);
        }
        
        if ($product->stock < $quantity) {
            throw new \Exception('Insufficient stock');
        }
        
        try {
            DB::beginTransaction();
            
            // Update item
            $item->quantity = $quantity;
            $item->subtotal = $product->price * $quantity;
            $item->save();
            
            // Recalculate cart totals
            $subtotal = $cart->items()->sum('subtotal');
            $cart->subtotal = $subtotal;
            $cart->total = $subtotal - $cart->discount;
            $cart->save();
            
            DB::commit();
            
            // Load product details for response
            $item->load('product');
            
            return [
                'item' => $item,
                'cart' => [
                    'subtotal' => $cart->subtotal,
                    'discount' => $cart->discount,
                    'discount_code' => $cart->discount_code,
                    'total' => $cart->total
                ]
            ];
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @inheritDoc
     */
    public function removeItem(int $userId, int $itemId)
    {
        $cart = $this->getForUser($userId);
        
        try {
            DB::beginTransaction();
            
            // Remove item
            $cart->items()->findOrFail($itemId)->delete();
            
            // Recalculate cart totals
            $subtotal = $cart->items()->sum('subtotal');
            $cart->subtotal = $subtotal;
            $cart->total = $subtotal - $cart->discount;
            $cart->save();
            
            DB::commit();
            
            return [
                'cart' => [
                    'subtotal' => $cart->subtotal,
                    'discount' => $cart->discount,
                    'discount_code' => $cart->discount_code,
                    'total' => $cart->total
                ]
            ];
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @inheritDoc
     */
    public function applyCoupon(int $userId, string $code)
    {
        $cart = $this->getForUser($userId);
        $coupon = Coupon::where('code', $code)->firstOrFail();
        
        if (!$coupon->isValidForCart($cart)) {
            throw new \Exception('Coupon is not valid');
        }
        
        try {
            DB::beginTransaction();
            
            // Calculate discount
            $discount = $coupon->calculateDiscountForCart($cart);
            
            // Apply discount to cart
            $cart->discount = $discount;
            $cart->discount_code = $code;
            $cart->total = $cart->subtotal - $discount;
            $cart->save();
            
            DB::commit();
            
            return [
                'cart' => [
                    'subtotal' => $cart->subtotal,
                    'discount' => $cart->discount,
                    'discount_code' => $cart->discount_code,
                    'total' => $cart->total
                ]
            ];
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @inheritDoc
     */
    public function removeCoupon(int $userId)
    {
        $cart = $this->getForUser($userId);
        
        try {
            DB::beginTransaction();
            
            // Remove discount
            $cart->discount = 0;
            $cart->discount_code = null;
            $cart->total = $cart->subtotal;
            $cart->save();
            
            DB::commit();
            
            return [
                'cart' => [
                    'subtotal' => $cart->subtotal,
                    'discount' => $cart->discount,
                    'discount_code' => $cart->discount_code,
                    'total' => $cart->total
                ]
            ];
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @inheritDoc
     */
    public function clearCart(int $userId)
    {
        $cart = $this->getForUser($userId);
        
        try {
            DB::beginTransaction();
            
            // Remove all items
            $cart->items()->delete();
            
            // Reset cart totals
            $cart->subtotal = 0;
            $cart->discount = 0;
            $cart->discount_code = null;
            $cart->total = 0;
            $cart->save();
            
            DB::commit();
            
            return $cart;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}

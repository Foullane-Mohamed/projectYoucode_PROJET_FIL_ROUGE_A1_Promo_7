<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\CartRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    protected $cartRepository;

    public function __construct(CartRepositoryInterface $cartRepository)
    {
        $this->cartRepository = $cartRepository;
    }

    /**
     * Get the user's cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function getCart(Request $request)
    {
        $cart = $this->cartRepository->getWithItemsByUserId($request->user()->id);
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'cart' => [
                    'items' => $cart->items,
                    'subtotal' => $cart->subtotal,
                    'discount' => $cart->discount,
                    'coupon' => $cart->coupon,
                    'total' => $cart->total
                ]
            ]
        ]);
    }

    /**
     * Add an item to the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function addItem(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->cartRepository->addItem(
                $request->user()->id,
                $request->product_id,
                $request->quantity
            );
            
            $cart = $this->cartRepository->getWithItemsByUserId($request->user()->id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Product added to cart',
                'data' => [
                    'cart' => [
                        'items' => $cart->items,
                        'subtotal' => $cart->subtotal,
                        'discount' => $cart->discount,
                        'coupon' => $cart->coupon,
                        'total' => $cart->total
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Update an item quantity.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateItem(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->cartRepository->updateItemQuantity(
                $request->user()->id,
                $id,
                $request->quantity
            );
            
            $cart = $this->cartRepository->getWithItemsByUserId($request->user()->id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Cart item updated',
                'data' => [
                    'cart' => [
                        'items' => $cart->items,
                        'subtotal' => $cart->subtotal,
                        'discount' => $cart->discount,
                        'coupon' => $cart->coupon,
                        'total' => $cart->total
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cart item not found'
            ], 404);
        }
    }

    /**
     * Remove an item from the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function removeItem(Request $request, $id)
    {
        try {
            $this->cartRepository->removeItem($request->user()->id, $id);
            
            $cart = $this->cartRepository->getWithItemsByUserId($request->user()->id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Item removed from cart',
                'data' => [
                    'cart' => [
                        'items' => $cart->items,
                        'subtotal' => $cart->subtotal,
                        'discount' => $cart->discount,
                        'coupon' => $cart->coupon,
                        'total' => $cart->total
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cart item not found'
            ], 404);
        }
    }

    /**
     * Apply a coupon to the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function applyCoupon(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|exists:coupons,code',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->cartRepository->applyCoupon($request->user()->id, $request->code);
            
            $cart = $this->cartRepository->getWithItemsByUserId($request->user()->id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Coupon applied successfully',
                'data' => [
                    'cart' => [
                        'items' => $cart->items,
                        'subtotal' => $cart->subtotal,
                        'discount' => $cart->discount,
                        'coupon' => $cart->coupon,
                        'total' => $cart->total
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    /**
     * Remove the coupon from the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function removeCoupon(Request $request)
    {
        try {
            $this->cartRepository->removeCoupon($request->user()->id);
            
            $cart = $this->cartRepository->getWithItemsByUserId($request->user()->id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Coupon removed',
                'data' => [
                    'cart' => [
                        'items' => $cart->items,
                        'subtotal' => $cart->subtotal,
                        'discount' => $cart->discount,
                        'coupon' => $cart->coupon,
                        'total' => $cart->total
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }
}

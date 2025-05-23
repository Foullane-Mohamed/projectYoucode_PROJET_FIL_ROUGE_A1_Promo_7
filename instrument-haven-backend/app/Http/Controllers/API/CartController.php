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


    public function applyCoupon(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }
        
        \Log::info('Attempting to apply coupon: ' . $request->code);

        try {
            $coupon = \App\Models\Coupon::where('code', $request->code)->first();
            
            if (!$coupon) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Coupon code not found'
                ], 404);
            }
            
            if (!$coupon->is_active) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This coupon is not active'
                ], 400);
            }
            
            if ($coupon->starts_at > now()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This coupon is not yet active'
                ], 400);
            }
            
            if ($coupon->expires_at < now()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This coupon has expired'
                ], 400);
            }
            
            if ($coupon->usage_limit && $coupon->usage_count >= $coupon->usage_limit) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'This coupon has reached its usage limit'
                ], 400);
            }
            
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
            \Log::error('Error applying coupon: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }


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

<?php

namespace App\Http\Controllers;

use App\Http\Requests\CartRequest;
use App\Services\CartService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Get the cart for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $userId = $request->user()->id;
            $cart = $this->cartService->getUserCart($userId);
            
            return response()->json([
                'status' => 'success',
                'data' => $cart
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Add a product to the cart.
     *
     * @param  \App\Http\Requests\CartRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CartRequest $request)
    {
        try {
            $userId = $request->user()->id;
            $productId = $request->input('product_id');
            $quantity = $request->input('quantity', 1);
            
            $cartItem = $this->cartService->addToCart($userId, $productId, $quantity);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Product added to cart successfully',
                'data' => $cartItem
            ], Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the quantity of a cart item.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $productId)
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);
            
            $userId = $request->user()->id;
            $quantity = $request->input('quantity');
            
            $cartItem = $this->cartService->updateCartItemQuantity($userId, $productId, $quantity);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Cart item updated successfully',
                'data' => $cartItem
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove a product from the cart.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $productId)
    {
        try {
            $userId = $request->user()->id;
            
            $this->cartService->removeFromCart($userId, $productId);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Product removed from cart successfully'
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Clear the cart for the authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function clear(Request $request)
    {
        try {
            $userId = $request->user()->id;
            
            $this->cartService->clearCart($userId);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Cart cleared successfully'
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
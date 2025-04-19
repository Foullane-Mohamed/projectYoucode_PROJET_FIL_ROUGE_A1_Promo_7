<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    /**
     * Display the wishlist for the authenticated user.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $wishlist = Wishlist::with('product')
            ->where('user_id', $request->user()->id)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product_name' => $item->product_name,
                    'price' => $item->price,
                    'thumbnail' => $item->thumbnail,
                    'in_stock' => $item->in_stock,
                    'added_at' => $item->added_at
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => [
                'wishlist' => $wishlist
            ]
        ]);
    }

    /**
     * Add a product to the wishlist.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if product is already in wishlist
        $existingItem = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existingItem) {
            return response()->json([
                'status' => 'success',
                'message' => 'Product already in wishlist',
                'data' => [
                    'wishlist_item' => [
                        'id' => $existingItem->id,
                        'product_id' => $existingItem->product_id,
                        'product_name' => $existingItem->product_name,
                        'price' => $existingItem->price,
                        'thumbnail' => $existingItem->thumbnail,
                        'in_stock' => $existingItem->in_stock,
                        'added_at' => $existingItem->added_at
                    ]
                ]
            ]);
        }

        // Add product to wishlist
        $wishlistItem = Wishlist::create([
            'user_id' => $request->user()->id,
            'product_id' => $request->product_id,
        ]);

        $wishlistItem->load('product');

        return response()->json([
            'status' => 'success',
            'message' => 'Product added to wishlist successfully',
            'data' => [
                'wishlist_item' => [
                    'id' => $wishlistItem->id,
                    'product_id' => $wishlistItem->product_id,
                    'product_name' => $wishlistItem->product_name,
                    'price' => $wishlistItem->price,
                    'thumbnail' => $wishlistItem->thumbnail,
                    'in_stock' => $wishlistItem->in_stock,
                    'added_at' => $wishlistItem->added_at
                ]
            ]
        ], 201);
    }

    /**
     * Remove a product from the wishlist.
     *
     * @param Request $request
     * @param int $productId
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $productId)
    {
        // Check if product is in wishlist
        $wishlistItem = Wishlist::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->first();

        if (!$wishlistItem) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found in wishlist'
            ], 404);
        }

        // Remove product from wishlist
        $wishlistItem->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product removed from wishlist successfully'
        ]);
    }
}

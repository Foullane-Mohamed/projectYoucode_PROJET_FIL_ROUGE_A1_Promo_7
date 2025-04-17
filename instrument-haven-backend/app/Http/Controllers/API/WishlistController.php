<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\WishlistRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    protected $wishlistRepository;

    public function __construct(WishlistRepository $wishlistRepository)
    {
        $this->wishlistRepository = $wishlistRepository;
    }

    public function getWishlist(Request $request)
    {
        $wishlist = $this->wishlistRepository->getWishlistByUser($request->user()->id);
        return response()->json(['data' => $wishlist]);
    }

    public function addToWishlist(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userId = $request->user()->id;
        $productId = $request->product_id;

        $existingItem = $this->wishlistRepository->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($existingItem) {
            return response()->json(['message' => 'Product already in wishlist']);
        }

        $wishlistItem = $this->wishlistRepository->create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);

        return response()->json(['message' => 'Product added to wishlist', 'data' => $wishlistItem], 201);
    }

    public function removeFromWishlist(Request $request, $productId)
    {
        $userId = $request->user()->id;

        $wishlistItem = $this->wishlistRepository->model
            ->where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if (!$wishlistItem) {
            return response()->json(['message' => 'Product not found in wishlist'], 404);
        }

        $this->wishlistRepository->delete($wishlistItem->id);
        return response()->json(['message' => 'Product removed from wishlist']);
    }
}
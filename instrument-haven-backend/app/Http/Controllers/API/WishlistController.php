<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\WishlistRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    protected $wishlistRepository;

    public function __construct(WishlistRepositoryInterface $wishlistRepository)
    {
        $this->wishlistRepository = $wishlistRepository;
    }

    public function index(Request $request)
    {
        $wishlist = $this->wishlistRepository->getByUserId($request->user()->id);
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'wishlist' => $wishlist
            ]
        ]);
    }

    
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|exists:products,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $wishlistItem = $this->wishlistRepository->addProduct(
            $request->user()->id,
            $request->product_id
        );

        if (!$wishlistItem) {
            return response()->json([
                'status' => 'info',
                'message' => 'Product is already in wishlist'
            ]);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Product added to wishlist',
            'data' => [
                'wishlist_item' => $wishlistItem
            ]
        ]);
    }


    public function destroy(Request $request, $productId)
    {
        $removed = $this->wishlistRepository->removeProduct(
            $request->user()->id,
            $productId
        );

        if (!$removed) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found in wishlist'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'message' => 'Product removed from wishlist'
        ]);
    }
}

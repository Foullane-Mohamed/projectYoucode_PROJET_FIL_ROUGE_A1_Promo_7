<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    /**
     * Display reviews for a product.
     *
     * @param Request $request
     * @param int $productId
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request, $productId)
    {
        $product = Product::find($productId);
        
        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        $perPage = $request->input('per_page', 10);
        $sortBy = $request->input('sort_by', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        
        // Validate sort parameters
        $allowedSortFields = ['rating', 'created_at'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'created_at';
        }
        
        if (!in_array($sortDirection, ['asc', 'desc'])) {
            $sortDirection = 'desc';
        }
        
        $reviewsQuery = Review::with('user:id,name')
            ->where('product_id', $productId)
            ->orderBy($sortBy, $sortDirection);
            
        $reviews = $reviewsQuery->paginate($perPage);
        
        // Add review summary
        $summary = [
            'average_rating' => $product->reviews->avg('rating') ?: 0,
            'count' => $product->reviews->count(),
            'rating_distribution' => [
                '5' => $product->reviews->where('rating', 5)->count(),
                '4' => $product->reviews->where('rating', 4)->count(),
                '3' => $product->reviews->where('rating', 3)->count(),
                '2' => $product->reviews->where('rating', 2)->count(),
                '1' => $product->reviews->where('rating', 1)->count(),
            ]
        ];

        return response()->json([
            'status' => 'success',
            'data' => [
                'reviews' => $reviews->items(),
                'summary' => $summary,
                'pagination' => [
                    'total' => $reviews->total(),
                    'per_page' => $reviews->perPage(),
                    'current_page' => $reviews->currentPage(),
                    'last_page' => $reviews->lastPage(),
                    'from' => $reviews->firstItem(),
                    'to' => $reviews->lastItem()
                ]
            ]
        ]);
    }

    /**
     * Store a newly created review.
     *
     * @param Request $request
     * @param int $productId
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if product exists
        $product = Product::find($productId);
        
        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        // Check if user has purchased the product
        $hasPurchased = Order::where('user_id', $request->user()->id)
            ->where('status', 'delivered')
            ->whereHas('items', function ($query) use ($productId) {
                $query->where('product_id', $productId);
            })
            ->exists();
            
        if (!$hasPurchased && !$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'You can only review products you have purchased'
            ], 403);
        }

        // Check if user has already reviewed this product
        $existingReview = Review::where('user_id', $request->user()->id)
            ->where('product_id', $productId)
            ->first();
            
        if ($existingReview) {
            return response()->json([
                'status' => 'error',
                'message' => 'You have already reviewed this product. Please update your existing review.'
            ], 422);
        }

        // Create review
        $review = Review::create([
            'user_id' => $request->user()->id,
            'product_id' => $productId,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        $review->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'message' => 'Review submitted successfully',
            'data' => [
                'review' => $review
            ]
        ], 201);
    }

    /**
     * Update the specified review.
     *
     * @param Request $request
     * @param int $productId
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $productId, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if review exists
        $review = Review::where('product_id', $productId)
            ->where('id', $id)
            ->first();
            
        if (!$review) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review not found'
            ], 404);
        }

        // Check if user is the owner of the review or an admin
        if ($review->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Update review
        $review->rating = $request->rating;
        $review->comment = $request->comment;
        $review->save();

        $review->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'message' => 'Review updated successfully',
            'data' => [
                'review' => $review
            ]
        ]);
    }

    /**
     * Remove the specified review.
     *
     * @param Request $request
     * @param int $productId
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $productId, $id)
    {
        // Check if review exists
        $review = Review::where('product_id', $productId)
            ->where('id', $id)
            ->first();
            
        if (!$review) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review not found'
            ], 404);
        }

        // Check if user is the owner of the review or an admin
        if ($review->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Delete review
        $review->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Review deleted successfully'
        ]);
    }
}

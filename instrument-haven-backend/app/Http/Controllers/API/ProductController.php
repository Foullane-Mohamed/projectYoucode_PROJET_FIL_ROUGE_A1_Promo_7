<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\ReviewRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    protected $productRepository;
    protected $reviewRepository;

    public function __construct(
        ProductRepositoryInterface $productRepository,
        ReviewRepositoryInterface $reviewRepository
    ) {
        $this->productRepository = $productRepository;
        $this->reviewRepository = $reviewRepository;
    }

    /**
     * Display a listing of the products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $filters = $request->only([
            'per_page', 'page', 'category_id', 'search', 'price_min', 'price_max', 'sort_by', 'sort_direction'
        ]);

        $products = $this->productRepository->filter($filters);

        return response()->json([
            'status' => 'success',
            'data' => [
                'products' => $products->items(),
                'pagination' => [
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'from' => $products->firstItem(),
                    'to' => $products->lastItem()
                ]
            ]
        ]);
    }

    /**
     * Display the specified product.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $product = $this->productRepository->find($id);
            
            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product not found'
                ], 404);
            }
            
            // Load relationships
            $product->load(['category', 'reviews.user']);
            
            // Add average rating - making sure method exists
            $product->average_rating = 0;
            if (method_exists($product, 'getAverageRatingAttribute')) {
                $product->average_rating = $product->getAverageRatingAttribute();
            }
            
            // Ensure images have correct paths for local storage
            if ($product->images) {
                // Handle string JSON if necessary
                if (is_string($product->images)) {
                    try {
                        $product->images = json_decode($product->images, true);
                    } catch (\Exception $e) {
                        \Log::warning("Failed to decode product {$id} images JSON: " . $e->getMessage());
                        $product->images = [];
                    }
                }
                
                if (is_array($product->images)) {
                    $fixedImages = [];
                    foreach ($product->images as $image) {
                        if (is_string($image)) {
                            // Keep only the filename part, removing any path information
                            $fixedImages[] = basename($image);
                        }
                    }
                    $product->images = $fixedImages;
                } else {
                    $product->images = [];
                }
            } else {
                $product->images = [];
            }
            
            if ($product->thumbnail) {
                // Keep only the filename part, removing any path information
                $product->thumbnail = basename($product->thumbnail);
            }
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'product' => $product
                ]
            ]);
        } catch (\Exception $e) {
            report($e); // Log the error
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found: ' . $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get reviews for a product
     *
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function getReviews($productId)
    {
        try {
            $reviews = $this->reviewRepository->getByProductId($productId);
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'reviews' => $reviews
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }
    }

    /**
     * Create a review for a product
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @return \Illuminate\Http\Response
     */
    public function createReview(Request $request, $productId)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->productRepository->find($productId);
            
            $review = $this->reviewRepository->createOrUpdate(
                $request->user()->id,
                $productId,
                $request->rating,
                $request->comment
            );
            
            return response()->json([
                'status' => 'success',
                'message' => 'Review added successfully',
                'data' => [
                    'review' => $review
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }
    }

    /**
     * Update a review for a product
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateReview(Request $request, $productId, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $review = $this->reviewRepository->find($id);
            
            if ($review->user_id !== $request->user()->id) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            if ($review->product_id != $productId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review does not belong to this product'
                ], 400);
            }
            
            $review = $this->reviewRepository->createOrUpdate(
                $request->user()->id,
                $productId,
                $request->rating,
                $request->comment
            );
            
            return response()->json([
                'status' => 'success',
                'message' => 'Review updated successfully',
                'data' => [
                    'review' => $review
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review not found'
            ], 404);
        }
    }

    /**
     * Delete a review for a product
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $productId
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function deleteReview(Request $request, $productId, $id)
    {
        try {
            $review = $this->reviewRepository->find($id);
            
            if ($review->user_id !== $request->user()->id && !$request->user()->isAdmin()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized'
                ], 403);
            }
            
            if ($review->product_id != $productId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Review does not belong to this product'
                ], 400);
            }
            
            $this->reviewRepository->delete($id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Review deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Review not found'
            ], 404);
        }
    }
}

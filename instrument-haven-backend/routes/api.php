<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ContactController;
use App\Http\Controllers\API\CouponController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\TagController;
use App\Http\Controllers\API\WishlistController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Products
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/category/{categoryId}', [ProductController::class, 'getProductsByCategory']);
Route::get('/products/tag/{tagId}', [ProductController::class, 'getProductsByTag']);
Route::get('/search', [ProductController::class, 'searchProducts']);

// Categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/parent-categories', [CategoryController::class, 'getParentCategories']);
Route::get('/categories/{id}/subcategories', [CategoryController::class, 'getCategoryWithSubcategories']);

// Tags
Route::get('/tags', [TagController::class, 'index']);

// Contact
Route::post('/contact', [ContactController::class, 'sendContactForm']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Wishlist
    Route::get('/wishlist', [WishlistController::class, 'getWishlist']);
    Route::post('/wishlist', [WishlistController::class, 'addToWishlist']);
    Route::delete('/wishlist/{productId}', [WishlistController::class, 'removeFromWishlist']);

    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/my-orders', [OrderController::class, 'getOrdersByUser']);

    // Validate coupon
    Route::post('/validate-coupon', [CouponController::class, 'validateCoupon']);

    // Admin routes
    Route::middleware('role:admin')->group(function () {
        // Categories management
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        // Products management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']); // Changed from POST to PUT
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        // Tags management
        Route::post('/tags', [TagController::class, 'store']);
        Route::put('/tags/{id}', [TagController::class, 'update']);
        Route::delete('/tags/{id}', [TagController::class, 'destroy']);

        // Orders management
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::put('/orders/{id}', [OrderController::class, 'update']);
        Route::get('/orders/status/{status}', [OrderController::class, 'getOrdersByStatus']);

        // Coupons management
        Route::get('/coupons', [CouponController::class, 'index']);
        Route::post('/coupons', [CouponController::class, 'store']);
        Route::get('/coupons/{id}', [CouponController::class, 'show']);
        Route::put('/coupons/{id}', [CouponController::class, 'update']);
        Route::delete('/coupons/{id}', [CouponController::class, 'destroy']);
    });
});
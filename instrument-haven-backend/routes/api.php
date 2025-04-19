<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\Admin\CouponController as AdminCouponController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use Illuminate\Support\Facades\Route;

/**
 * Public routes
 */
Route::prefix('v1')->group(function () {
    // Auth
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Products
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);

    // Reviews
    Route::get('/products/{productId}/reviews', [ReviewController::class, 'index']);

    // Contact
    Route::post('/contact', [ContactController::class, 'store']);

    /**
     * Protected routes
     */
    Route::middleware('auth:sanctum')->group(function () {
        // Auth
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/user', [AuthController::class, 'user']);

        // Cart
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart/items', [CartController::class, 'addItem']);
        Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
        Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
        Route::post('/cart/apply-coupon', [CartController::class, 'applyCoupon']);
        Route::post('/cart/remove-coupon', [CartController::class, 'removeCoupon']);

        // Wishlist
        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist', [WishlistController::class, 'store']);
        Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']);

        // Reviews
        Route::post('/products/{productId}/reviews', [ReviewController::class, 'store']);
        Route::put('/products/{productId}/reviews/{id}', [ReviewController::class, 'update']);
        Route::delete('/products/{productId}/reviews/{id}', [ReviewController::class, 'destroy']);

        /**
         * Admin routes
         */
        Route::prefix('admin')->group(function () {
            // Middleware to check if user is admin
            Route::middleware('admin')->group(function () {
                // Dashboard statistics
                Route::get('/dashboard', [DashboardController::class, 'index']);

                // Users management
                Route::get('/users', [AdminUserController::class, 'index']);
                Route::get('/users/{id}', [AdminUserController::class, 'show']);
                Route::put('/users/{id}', [AdminUserController::class, 'update']);

                // Orders management
                Route::get('/orders', [AdminOrderController::class, 'index']);
                Route::put('/orders/{id}', [AdminOrderController::class, 'update']);
                Route::get('/orders/statistics', [AdminOrderController::class, 'statistics']);

                // Products management
                Route::post('/products', [ProductController::class, 'store']);
                Route::put('/products/{id}', [ProductController::class, 'update']);
                Route::delete('/products/{id}', [ProductController::class, 'destroy']);

                // Categories management
                Route::post('/categories', [CategoryController::class, 'store']);
                Route::put('/categories/{id}', [CategoryController::class, 'update']);
                Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

                // Coupons management
                Route::get('/coupons', [AdminCouponController::class, 'index']);
                Route::post('/coupons', [AdminCouponController::class, 'store']);
                Route::put('/coupons/{id}', [AdminCouponController::class, 'update']);
                Route::delete('/coupons/{id}', [AdminCouponController::class, 'destroy']);
            });
        });
    });
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Api\Admin\CouponController as AdminCouponController;


Route::prefix('v1')->middleware(['cors'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
    });

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/products/{productId}/reviews', [ProductController::class, 'getReviews']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);

    Route::post('/contact', [ContactController::class, 'submit']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::prefix('auth')->group(function () {
            Route::get('/user', [AuthController::class, 'user']);
            Route::put('/user/update', [AuthController::class, 'updateProfile']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });

        Route::get('/cart', [CartController::class, 'getCart']);
        Route::post('/cart/items', [CartController::class, 'addItem']);
        Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
        Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
        Route::post('/cart/apply-coupon', [CartController::class, 'applyCoupon']);
        Route::post('/cart/remove-coupon', [CartController::class, 'removeCoupon']);

        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist', [WishlistController::class, 'store']);
        Route::delete('/wishlist/{productId}', [WishlistController::class, 'destroy']);

        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/my', [OrderController::class, 'index']);
        Route::get('/orders/{id}', [OrderController::class, 'show']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']);

        Route::post('/products/{productId}/reviews', [ProductController::class, 'createReview']);
        Route::put('/products/{productId}/reviews/{id}', [ProductController::class, 'updateReview']);
        Route::delete('/products/{productId}/reviews/{id}', [ProductController::class, 'deleteReview']);

        Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('/dashboard', [DashboardController::class, 'statistics']);

            Route::get('/users', [AdminUserController::class, 'index']);
            Route::post('/users', [AdminUserController::class, 'store']);
            Route::get('/users/{id}', [AdminUserController::class, 'show']);
            Route::put('/users/{id}', [AdminUserController::class, 'update']);
            Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);

            Route::get('/orders', [AdminOrderController::class, 'index']);
            Route::put('/orders/{id}', [AdminOrderController::class, 'update']);
            Route::get('/orders/statistics', [AdminOrderController::class, 'statistics']);

            Route::post('/products', [AdminProductController::class, 'store']);
            Route::put('/products/{id}', [AdminProductController::class, 'update']);
            Route::delete('/products/{id}', [AdminProductController::class, 'destroy']);

            Route::get('/categories', [AdminCategoryController::class, 'index']);
            Route::post('/categories', [AdminCategoryController::class, 'store']);
            Route::put('/categories/{id}', [AdminCategoryController::class, 'update']);
            Route::delete('/categories/{id}', [AdminCategoryController::class, 'destroy']);

            Route::get('/coupons', [AdminCouponController::class, 'index']);
            Route::post('/coupons', [AdminCouponController::class, 'store']);
            Route::put('/coupons/{id}', [AdminCouponController::class, 'update']);
            Route::delete('/coupons/{id}', [AdminCouponController::class, 'destroy']);
        });
    });
});

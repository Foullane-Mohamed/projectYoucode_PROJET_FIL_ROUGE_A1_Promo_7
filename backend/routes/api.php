<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SubCategoryController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Public routes
// Categories
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{id}', [CategoryController::class, 'show']);
Route::get('categories-with-subcategories', [CategoryController::class, 'withSubcategories']);

// Subcategories
Route::get('subcategories', [SubCategoryController::class, 'index']);
Route::get('subcategories/{id}', [SubCategoryController::class, 'show']);
Route::get('subcategories/category/{categoryId}', [SubCategoryController::class, 'byCategory']);
Route::get('subcategories-with-products', [SubCategoryController::class, 'withProducts']);

// Products
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);
Route::get('products/search', [ProductController::class, 'search']);
Route::get('products/latest', [ProductController::class, 'latest']);
Route::get('products/subcategory/{subcategoryId}', [ProductController::class, 'bySubcategory']);
Route::get('products/price-range', [ProductController::class, 'priceRange']);

// Comments
Route::get('comments/product/{productId}', [CommentController::class, 'byProduct']);
Route::get('comments/product/{productId}/rating', [CommentController::class, 'productRating']);

// Contact
Route::post('contact', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('profile', [AuthController::class, 'profile']);
    
    // Protected category routes
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{id}', [CategoryController::class, 'update']);
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);
    
    // Protected subcategory routes
    Route::post('subcategories', [SubCategoryController::class, 'store']);
    Route::put('subcategories/{id}', [SubCategoryController::class, 'update']);
    Route::delete('subcategories/{id}', [SubCategoryController::class, 'destroy']);
    
    // Protected product routes
    Route::post('products', [ProductController::class, 'store']);
    Route::put('products/{id}', [ProductController::class, 'update']);
    Route::delete('products/{id}', [ProductController::class, 'destroy']);
    
    // Cart routes
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart', [CartController::class, 'store']);
    Route::put('cart/{productId}', [CartController::class, 'update']);
    Route::delete('cart/{productId}', [CartController::class, 'destroy']);
    Route::delete('cart', [CartController::class, 'clear']);
    
    // Comment routes
    Route::post('comments', [CommentController::class, 'store']);
    Route::put('comments/{id}', [CommentController::class, 'update']);
    Route::delete('comments/{id}', [CommentController::class, 'destroy']);
    Route::get('user/comments', [CommentController::class, 'byUser']);

    // Order routes
    Route::get('user/orders', [OrderController::class, 'userOrders']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/{id}', [OrderController::class, 'show']);

    // Admin-only routes
    Route::middleware('admin')->group(function () {
        // Dashboard stats
        // Route::get('admin/dashboard/stats', function () {
        //     // Return dashboard statistics
        //     return response()->json([
        //         'status' => 'success',
        //         'data' => [
        //             'users' => \App\Models\User::count(),
        //             'products' => \App\Models\Product::count(),
        //             'orders' => \App\Models\Order::count(),
        //             'revenue' => \App\Models\Order::where('status', 'completed')->sum('total'),
        //         ]
        //     ]);
        // });


        Route::get('admin/dashboard/stats', [DashboardController::class, 'getStats']);
        Route::get('admin/dashboard/recent-orders', [DashboardController::class, 'getRecentOrders']);
        Route::get('admin/dashboard/low-stock', [DashboardController::class, 'getLowStockProducts']);
              // Orders management
              Route::get('orders', [OrderController::class, 'index']);
              Route::put('orders/{id}/status', [OrderController::class, 'updateStatus']);
              Route::get('orders/status/{status}', [OrderController::class, 'byStatus']);
              Route::get('orders/monthly', [OrderController::class, 'monthlyOrders']);
        
  
        
        // Payment Method routes
        Route::get('payment-methods', [PaymentMethodController::class, 'index']);
        Route::post('payment-methods', [PaymentMethodController::class, 'store']);
        Route::get('payment-methods/{id}', [PaymentMethodController::class, 'show']);
        Route::put('payment-methods/{id}', [PaymentMethodController::class, 'update']);
        Route::delete('payment-methods/{id}', [PaymentMethodController::class, 'destroy']);
        Route::get('payment-methods/active', [PaymentMethodController::class, 'getActive']);
        
        // Coupon routes
        Route::get('coupons', [CouponController::class, 'index']);
        Route::post('coupons', [CouponController::class, 'store']);
        Route::get('coupons/{id}', [CouponController::class, 'show']);
        Route::put('coupons/{id}', [CouponController::class, 'update']);
        Route::delete('coupons/{id}', [CouponController::class, 'destroy']);
        Route::get('coupons/active', [CouponController::class, 'active']);
        
        // Contact routes (admin)
        Route::get('contacts', [ContactController::class, 'index']);
        Route::get('contacts/{id}', [ContactController::class, 'show']);
        Route::put('contacts/{id}', [ContactController::class, 'update']);
        Route::delete('contacts/{id}', [ContactController::class, 'destroy']);
        Route::get('contacts/status/{status}', [ContactController::class, 'byStatus']);
        
        // Role routes
        Route::get('roles', [RoleController::class, 'index']);
        Route::post('roles', [RoleController::class, 'store']);
        Route::get('roles/{id}', [RoleController::class, 'show']);
        Route::put('roles/{id}', [RoleController::class, 'update']);
        Route::delete('roles/{id}', [RoleController::class, 'destroy']);
        
        // User routes
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::get('users/{id}', [UserController::class, 'show']);
        Route::put('users/{id}', [UserController::class, 'update']);
        Route::delete('users/{id}', [UserController::class, 'destroy']);
        Route::get('users/search', [UserController::class, 'search']);
        Route::get('users/role/{roleId}', [UserController::class, 'byRole']);

        
    });
});
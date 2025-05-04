<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
  
    public function register(): void
    {
        $this->app->singleton('App\Services\Interfaces\CartServiceInterface', 'App\Services\CartService');
        $this->app->singleton('App\Services\Interfaces\OrderServiceInterface', 'App\Services\OrderService');
        $this->app->singleton('App\Services\Interfaces\ProductServiceInterface', 'App\Services\ProductService');
        $this->app->singleton('App\Services\Interfaces\CouponServiceInterface', 'App\Services\CouponService');
        $this->app->singleton('App\Services\Interfaces\CartItemServiceInterface', 'App\Services\CartItemService');
        $this->app->singleton('App\Services\Interfaces\CategoryServiceInterface', 'App\Services\CategoryService');
    }


    public function boot(): void
    {
        //
    }
}

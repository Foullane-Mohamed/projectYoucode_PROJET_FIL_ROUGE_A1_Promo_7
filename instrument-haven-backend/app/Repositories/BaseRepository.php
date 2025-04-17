<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\RepositoryInterface;
use App\Repositories\BaseRepository;
use App\Repositories\ProductRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\TagRepository;
use App\Repositories\OrderRepository;
use App\Repositories\CouponRepository;
use App\Repositories\WishlistRepository;
use App\Repositories\UserRepository;
use App\Models\Product;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Order;
use App\Models\Coupon;
use App\Models\Wishlist;
use App\Models\User;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(RepositoryInterface::class, BaseRepository::class);
        
        $this->app->bind(ProductRepository::class, function ($app) {
            return new ProductRepository(new Product());
        });
        
        $this->app->bind(CategoryRepository::class, function ($app) {
            return new CategoryRepository(new Category());
        });
        
        $this->app->bind(TagRepository::class, function ($app) {
            return new TagRepository(new Tag());
        });
        
        $this->app->bind(OrderRepository::class, function ($app) {
            return new OrderRepository(new Order());
        });
        
        $this->app->bind(CouponRepository::class, function ($app) {
            return new CouponRepository(new Coupon());
        });
        
        $this->app->bind(WishlistRepository::class, function ($app) {
            return new WishlistRepository(new Wishlist());
        });
        
        $this->app->bind(UserRepository::class, function ($app) {
            return new UserRepository(new User());
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
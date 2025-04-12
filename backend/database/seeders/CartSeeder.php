<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get customers
        $customers = User::whereHas('role', function ($query) {
            $query->where('name', 'Customer');
        })->get();

        if ($customers->isEmpty()) {
            return;
        }

        // Get products
        $products = Product::where('stock', '>', 0)->get();

        if ($products->isEmpty()) {
            return;
        }

        // Add some items to carts for different users
        foreach ($customers as $index => $customer) {
            // Add 0-4 items to cart (some users will have empty carts)
            $itemCount = rand(0, 4);
            
            // Get random products for this user
            $userProducts = $products->random(min($itemCount, $products->count()));
            
            foreach ($userProducts as $product) {
                // Random quantity between 1 and 3 (not exceeding stock)
                $quantity = rand(1, min(3, $product->stock));
                
                Cart::create([
                    'user_id' => $customer->id,
                    'product_id' => $product->id,
                    'quantity' => $quantity
                ]);
            }
        }
    }
}
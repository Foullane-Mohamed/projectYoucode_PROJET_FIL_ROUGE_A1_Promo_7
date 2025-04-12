<?php

namespace Database\Seeders;

use App\Models\Coupon;
use App\Models\Order;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
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

        // Get payment methods
        $paymentMethods = PaymentMethod::where('is_active', true)->get();
        
        if ($paymentMethods->isEmpty()) {
            return;
        }

        // Get active coupons
        $coupons = Coupon::where('is_active', true)
                        ->where(function ($query) {
                            $query->whereNull('start_date')
                                  ->orWhere('start_date', '<=', Carbon::now());
                        })
                        ->where(function ($query) {
                            $query->whereNull('end_date')
                                  ->orWhere('end_date', '>=', Carbon::now());
                        })
                        ->get();

        // Order statuses
        $statuses = ['pending', 'processing', 'completed', 'cancelled'];
        
        // Generate 15-25 orders
        $orderCount = rand(15, 25);
        
        for ($i = 0; $i < $orderCount; $i++) {
            // Random customer
            $customer = $customers->random();
            
            // Random payment method
            $paymentMethod = $paymentMethods->random();
            
            // Random status
            $status = $statuses[array_rand($statuses)];
            
            // Random coupon (20% chance of using coupon)
            $couponId = (rand(1, 5) === 1 && $coupons->count() > 0) ? $coupons->random()->id : null;
            
            // Random date within the last 90 days
            $orderDate = Carbon::now()->subDays(rand(0, 90));
            
            // Create the order
            $order = Order::create([
                'user_id' => $customer->id,
                'total' => 0, // Will calculate after adding products
                'status' => $status,
                'payment_method_id' => $paymentMethod->id,
                'coupon_id' => $couponId,
                'shipping_address' => $customer->address ?? '123 Main St, Anytown, AN 12345',
                'billing_address' => $customer->address ?? '123 Main St, Anytown, AN 12345',
                'tracking_number' => $status !== 'pending' ? 'TRK' . rand(100000, 999999) : null,
                'created_at' => $orderDate,
                'updated_at' => $orderDate
            ]);

            // Add 1-5 products to the order
            $productCount = rand(1, 5);
            $orderProducts = $products->random(min($productCount, $products->count()));
            
            $total = 0;
            
            foreach ($orderProducts as $product) {
                // Random quantity between 1 and 3
                $quantity = rand(1, 3);
                
                // Attach product to order
                $order->products()->attach($product->id, [
                    'quantity' => $quantity,
                    'price' => $product->price,
                    'created_at' => $orderDate,
                    'updated_at' => $orderDate
                ]);
                
                $total += $product->price * $quantity;
            }
            
            // Apply coupon discount if applicable
            if ($couponId && $coupon = Coupon::find($couponId)) {
                if ($coupon->type === 'percentage') {
                    $total = $total - ($total * $coupon->discount / 100);
                } else { // fixed amount
                    $total = max(0, $total - $coupon->discount);
                }
            }
            
            // Update the order total
            $order->update(['total' => $total]);
        }
    }
}
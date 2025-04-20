<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Coupon;

class CouponsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create coupons
        Coupon::create([
            'code' => 'WELCOME10',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'min_order_amount' => 50,
            'max_discount_amount' => 100,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(3),
            'is_active' => true,
            'usage_limit' => 1000,
            'usage_count' => 0,
        ]);
        
        Coupon::create([
            'code' => 'SUMMER20',
            'discount_type' => 'percentage',
            'discount_value' => 20,
            'min_order_amount' => 100,
            'max_discount_amount' => 200,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(2),
            'is_active' => true,
            'usage_limit' => 500,
            'usage_count' => 0,
        ]);
        
        Coupon::create([
            'code' => 'FLAT50',
            'discount_type' => 'fixed',
            'discount_value' => 50,
            'min_order_amount' => 250,
            'max_discount_amount' => null,
            'starts_at' => now(),
            'expires_at' => now()->addMonths(1),
            'is_active' => true,
            'usage_limit' => 200,
            'usage_count' => 0,
        ]);
    }
}

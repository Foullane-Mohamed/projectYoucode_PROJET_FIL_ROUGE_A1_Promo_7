<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Coupon::create([
            'code' => 'WELCOME10',
            'type' => 'percentage',
            'discount' => 10,
            'min_purchase' => 50,
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addYear(),
            'usage_limit' => 0,
            'usage_count' => 0,
            'description' => 'Welcome discount for new customers',
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'SUMMER2025',
            'type' => 'percentage',
            'discount' => 15,
            'min_purchase' => 100,
            'start_date' => Carbon::create(2025, 6, 1),
            'end_date' => Carbon::create(2025, 8, 31),
            'usage_limit' => 200,
            'usage_count' => 0,
            'description' => 'Summer season discount',
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'FLAT50',
            'type' => 'fixed',
            'discount' => 50,
            'min_purchase' => 200,
            'start_date' => Carbon::now(),
            'end_date' => Carbon::now()->addMonths(3),
            'usage_limit' => 100,
            'usage_count' => 0,
            'description' => 'Flat $50 off on orders over $200',
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'HOLIDAY25',
            'type' => 'percentage',
            'discount' => 25,
            'min_purchase' => 150,
            'start_date' => Carbon::create(2025, 12, 1),
            'end_date' => Carbon::create(2025, 12, 31),
            'usage_limit' => 300,
            'usage_count' => 0,
            'description' => 'Holiday season discount',
            'is_active' => true,
        ]);
    }
}

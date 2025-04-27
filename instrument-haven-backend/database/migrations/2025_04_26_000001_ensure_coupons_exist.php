<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Coupon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if any coupons exist
        if (Coupon::count() === 0) {
            $coupons = [
                [
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
                ],
                [
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
                ],
                [
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
                ],
                [
                    'code' => 'TEST',
                    'discount_type' => 'percentage',
                    'discount_value' => 15,
                    'min_order_amount' => 10,
                    'max_discount_amount' => 50,
                    'starts_at' => now(),
                    'expires_at' => now()->addYear(),
                    'is_active' => true,
                    'usage_limit' => null,
                    'usage_count' => 0,
                ]
            ];

            foreach ($coupons as $coupon) {
                Coupon::create($coupon);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse as this is just ensuring data exists
    }
};

<?php
// Script to create working coupon codes
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Coupon;
use Illuminate\Support\Facades\DB;

echo "Creating/checking coupons...\n\n";

// Clear any existing coupons for testing
try {
    DB::table('coupons')->truncate();
    echo "Cleared existing coupons for fresh start.\n";
} catch (Exception $e) {
    echo "Error clearing coupons: " . $e->getMessage() . "\n";
}

// Define test coupons
$coupons = [
    [
        'code' => 'TEST10',
        'discount_type' => 'percentage',
        'discount_value' => 10,
        'min_order_amount' => null,
        'max_discount_amount' => null,
        'starts_at' => now(),
        'expires_at' => now()->addYear(),
        'is_active' => true,
        'usage_limit' => null,
        'usage_count' => 0,
    ],
    [
        'code' => 'SAVE20',
        'discount_type' => 'percentage',
        'discount_value' => 20,
        'min_order_amount' => 100,
        'max_discount_amount' => 50,
        'starts_at' => now(),
        'expires_at' => now()->addYear(),
        'is_active' => true,
        'usage_limit' => null,
        'usage_count' => 0,
    ],
    [
        'code' => 'FLAT50',
        'discount_type' => 'fixed',
        'discount_value' => 50,
        'min_order_amount' => 200,
        'max_discount_amount' => null,
        'starts_at' => now(),
        'expires_at' => now()->addYear(),
        'is_active' => true,
        'usage_limit' => null,
        'usage_count' => 0,
    ],
    [
        'code' => 'K8VL6VDJ', // The specific coupon you tried to use
        'discount_type' => 'percentage',
        'discount_value' => 15,
        'min_order_amount' => null,
        'max_discount_amount' => null,
        'starts_at' => now(),
        'expires_at' => now()->addYear(),
        'is_active' => true,
        'usage_limit' => null,
        'usage_count' => 0,
    ],
];

// Create the coupons
foreach ($coupons as $couponData) {
    try {
        $coupon = Coupon::create($couponData);
        echo "Created coupon: {$coupon->code}\n";
    } catch (Exception $e) {
        echo "Error creating coupon {$couponData['code']}: " . $e->getMessage() . "\n";
    }
}

echo "\nAll available coupons:\n";
$allCoupons = Coupon::all();
foreach ($allCoupons as $c) {
    echo "- {$c->code}: " . 
         ($c->discount_type === 'percentage' ? "{$c->discount_value}%" : "\${$c->discount_value}") . 
         ($c->is_active ? " (Active)" : " (Inactive)") . 
         ($c->min_order_amount ? " Min: \${$c->min_order_amount}" : "") . 
         "\n";
}

echo "\nUse these coupons in your checkout:\n";
echo "- TEST10: 10% off with no minimum\n";
echo "- SAVE20: 20% off with minimum order of \$100\n";
echo "- FLAT50: \$50 off with minimum order of \$200\n";
echo "- K8VL6VDJ: 15% off with no minimum\n";

<?php
// Add test coupon
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Coupon;

// Check if the coupon already exists
$coupon = Coupon::where('code', 'K8VL6VDJ')->first();

if (!$coupon) {
    // Create the coupon
    $coupon = Coupon::create([
        'code' => 'K8VL6VDJ',
        'discount_type' => 'percentage',
        'discount_value' => 10,
        'min_order_amount' => null,
        'max_discount_amount' => null,
        'starts_at' => now(),
        'expires_at' => now()->addYear(),
        'is_active' => true,
        'usage_limit' => null,
        'usage_count' => 0,
    ]);
    
    echo "Created coupon K8VL6VDJ successfully.\n";
} else {
    // Make sure it's active
    if (!$coupon->is_active) {
        $coupon->is_active = true;
        $coupon->save();
        echo "Activated existing coupon K8VL6VDJ.\n";
    } else {
        echo "Coupon K8VL6VDJ already exists and is active.\n";
    }
}

echo "Coupon details:\n";
echo "Code: {$coupon->code}\n";
echo "Type: {$coupon->discount_type}\n";
echo "Value: {$coupon->discount_value}%\n";
echo "Active: " . ($coupon->is_active ? "Yes" : "No") . "\n";
echo "Expires: {$coupon->expires_at}\n";

// Now, let's also check all existing coupons
echo "\nAll available coupons in the system:\n";
$allCoupons = Coupon::all();
foreach ($allCoupons as $c) {
    echo "- {$c->code}: " . 
         ($c->discount_type === 'percentage' ? "{$c->discount_value}%" : "\${$c->discount_value}") . 
         ($c->is_active ? " (Active)" : " (Inactive)") . 
         ($c->min_order_amount ? " Min: \${$c->min_order_amount}" : "") . 
         "\n";
}

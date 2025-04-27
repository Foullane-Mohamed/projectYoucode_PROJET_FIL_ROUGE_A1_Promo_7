<?php

/**
 * This script diagnoses and fixes coupon-related issues
 */

// Load Laravel environment
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Coupon;
use App\Models\Cart;
use Illuminate\Support\Facades\DB;

echo "Running coupon diagnostic...\n";

// Check coupon table
try {
    echo "Checking coupon table structure...\n";
    $hasTable = Schema::hasTable('coupons');
    echo "Coupons table exists: " . ($hasTable ? 'Yes' : 'No') . "\n";
    
    if ($hasTable) {
        $columns = Schema::getColumnListing('coupons');
        echo "Coupon table columns: " . implode(', ', $columns) . "\n";
        
        // Check required columns
        $requiredColumns = [
            'id', 'code', 'discount_type', 'discount_value', 
            'starts_at', 'expires_at', 'is_active'
        ];
        
        $missingColumns = array_diff($requiredColumns, $columns);
        if (count($missingColumns) > 0) {
            echo "WARNING: Missing required columns: " . implode(', ', $missingColumns) . "\n";
        } else {
            echo "All required columns are present.\n";
        }
    }
    
    // Check for coupons
    $couponsCount = Coupon::count();
    echo "Found $couponsCount coupons in the database.\n";
    
    if ($couponsCount === 0) {
        echo "Creating default coupons...\n";
        
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
        
        foreach ($coupons as $couponData) {
            $coupon = Coupon::create($couponData);
            echo "Created coupon: {$coupon->code}\n";
        }
        
        echo "Created " . count($coupons) . " coupons.\n";
    } else {
        echo "Listing available coupons:\n";
        $coupons = Coupon::all();
        foreach ($coupons as $coupon) {
            $status = $coupon->is_active ? 'Active' : 'Inactive';
            $expires = $coupon->expires_at ? $coupon->expires_at->format('Y-m-d') : 'Never';
            $discount = $coupon->discount_type === 'percentage' 
                ? "{$coupon->discount_value}%" 
                : "\${$coupon->discount_value}";
            
            echo "- {$coupon->code}: $discount ($status, Expires: $expires)\n";
            
            // Verify coupon
            $isValid = $coupon->isValid();
            echo "  Valid for use: " . ($isValid ? 'Yes' : 'No') . "\n";
            
            if (!$isValid) {
                echo "  Reason for invalidity:\n";
                if (!$coupon->is_active) echo "  - Coupon is not active\n";
                if ($coupon->starts_at > now()) echo "  - Coupon start date is in the future\n";
                if ($coupon->expires_at < now()) echo "  - Coupon has expired\n";
                if ($coupon->usage_limit && $coupon->usage_count >= $coupon->usage_limit) {
                    echo "  - Usage limit reached\n";
                }
            }
            
            if ($coupon->min_order_amount) {
                echo "  Minimum order amount: \${$coupon->min_order_amount}\n";
            }
            
            if ($coupon->discount_type === 'percentage' && $coupon->max_discount_amount) {
                echo "  Maximum discount: \${$coupon->max_discount_amount}\n";
            }
        }
    }
    
    // Test a specific coupon
    echo "\nTesting coupon application mechanism...\n";
    
    // Find a valid coupon
    $testCoupon = Coupon::where('is_active', true)
        ->where('starts_at', '<=', now())
        ->where('expires_at', '>=', now())
        ->first();
    
    if ($testCoupon) {
        echo "Using test coupon: {$testCoupon->code}\n";
        
        // Create test cart if needed
        $testCart = new Cart();
        $testCart->setTable('carts'); // Ensure table name is set correctly
        
        try {
            $result = $testCart->applyCoupon($testCoupon->code);
            echo "Coupon application test result: " . json_encode($result) . "\n";
            echo "Test successful!\n";
        } catch (\Exception $e) {
            echo "Error applying coupon: " . $e->getMessage() . "\n";
            echo "Exception trace: " . $e->getTraceAsString() . "\n";
        }
    } else {
        echo "No valid coupon found for testing.\n";
    }
    
    echo "\nCoupon diagnostic complete!\n";
} catch (\Exception $e) {
    echo "Error during diagnostic: " . $e->getMessage() . "\n";
    echo "Exception trace: " . $e->getTraceAsString() . "\n";
}

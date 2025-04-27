<?php

/**
 * This script fixes database integrity issues related to products
 */

// Load Laravel environment
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;
use App\Models\Review;
use Illuminate\Support\Facades\DB;

echo "Checking for database issues...\n";

// Check products table
try {
    echo "Checking products table...\n";
    $products = Product::all();
    echo "Found " . count($products) . " products.\n";

    // Check for products with invalid images
    $fixedProducts = 0;
    foreach ($products as $product) {
        $modified = false;

        // Ensure images is an array
        if (is_string($product->images)) {
            try {
                $product->images = json_decode($product->images, true) ?: [];
                $modified = true;
                echo "Fixed string images for product {$product->id}\n";
            } catch (Exception $e) {
                echo "Error fixing images for product {$product->id}: {$e->getMessage()}\n";
                $product->images = [];
                $modified = true;
            }
        }

        // If images is null, set to empty array
        if ($product->images === null) {
            $product->images = [];
            $modified = true;
            echo "Fixed null images for product {$product->id}\n";
        }

        // Fix any invalid image paths
        if (is_array($product->images)) {
            $validImages = [];
            foreach ($product->images as $image) {
                if (is_string($image)) {
                    $validImages[] = basename($image);
                }
            }
            if (count($validImages) !== count($product->images)) {
                $product->images = $validImages;
                $modified = true;
                echo "Fixed invalid image paths for product {$product->id}\n";
            }
        }

        // If thumbnail is null, try to set from images
        if ($product->thumbnail === null && is_array($product->images) && !empty($product->images)) {
            $product->thumbnail = $product->images[0];
            $modified = true;
            echo "Set thumbnail from images for product {$product->id}\n";
        }

        // Save if modified
        if ($modified) {
            $product->save();
            $fixedProducts++;
        }
    }

    echo "Fixed {$fixedProducts} products.\n";

    // Check reviews table
    echo "\nChecking reviews table...\n";
    $reviews = Review::all();
    echo "Found " . count($reviews) . " reviews.\n";

    // Check for reviews with invalid ratings
    $fixedReviews = 0;
    foreach ($reviews as $review) {
        $modified = false;

        // Ensure rating is between 1 and 5
        if ($review->rating < 1 || $review->rating > 5) {
            $review->rating = max(1, min(5, $review->rating));
            $modified = true;
            echo "Fixed invalid rating for review {$review->id}\n";
        }

        // Save if modified
        if ($modified) {
            $review->save();
            $fixedReviews++;
        }
    }

    echo "Fixed {$fixedReviews} reviews.\n";

    echo "\nDatabase check complete!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

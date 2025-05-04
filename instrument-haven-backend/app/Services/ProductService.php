<?php

namespace App\Services;

use App\Models\Product;
use App\Services\Interfaces\ProductServiceInterface;

class ProductService implements ProductServiceInterface
{

    public function getImageUrl(Product $product)
    {
        if ($product->thumbnail) {
            $filename = basename($product->thumbnail);
            return $filename;
        }
        
        return null;
    }

    public function getImageUrls(Product $product)
    {
        if ($product->images && is_array($product->images)) {
            return array_map(function($image) {
                return basename($image);
            }, $product->images);
        }
        
        return [];
    }


    public function calculateAverageRating(Product $product)
    {
        try {
            if (!$product->relationLoaded('reviews')) {
                $product->load('reviews');
            }
            
            $reviewsCount = $product->reviews->count();
            if ($reviewsCount === 0) {
                return 0;
            }
            
            $sum = $product->reviews->sum('rating');
            return round($sum / $reviewsCount, 1);
        } catch (\Exception $e) {
            \Log::error('Error calculating average rating: ' . $e->getMessage());
            return 0;
        }
    }
}

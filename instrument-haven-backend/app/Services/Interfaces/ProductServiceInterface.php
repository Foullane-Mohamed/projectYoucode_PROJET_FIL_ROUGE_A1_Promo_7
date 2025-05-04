<?php

namespace App\Services\Interfaces;

use App\Models\Product;

interface ProductServiceInterface
{

    public function getImageUrl(Product $product);
    

    public function getImageUrls(Product $product);


    public function calculateAverageRating(Product $product);
}

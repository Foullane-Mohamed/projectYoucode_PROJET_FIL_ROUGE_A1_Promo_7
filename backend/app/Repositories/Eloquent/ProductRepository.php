<?php

namespace App\Repositories\Eloquent;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;

class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function findBySubcategory(int $subcategoryId)
    {
        return $this->model->where('subcategory_id', $subcategoryId)->get();
    }

    public function searchProducts(string $term)
    {
        return $this->model->where('name', 'like', "%{$term}%")
                          ->orWhere('description', 'like', "%{$term}%")
                          ->get();
    }

    public function getLatestProducts(int $limit = 8)
    {
        return $this->model->latest()->take($limit)->get();
    }

    public function getProductsOnSale(int $limit = 8)
    {
        // Assuming you might add a 'sale_price' column or 'on_sale' flag in the future
        // For now, this is a placeholder returning the latest products
        return $this->model->latest()->take($limit)->get();
    }

    public function findWithinPriceRange(float $min, float $max)
    {
        return $this->model->whereBetween('price', [$min, $max])->get();
    }

    public function updateStock(int $id, int $quantity)
    {
        $product = $this->findById($id);
        $product->stock = $quantity;
        $product->save();
        return $product;
    }
}
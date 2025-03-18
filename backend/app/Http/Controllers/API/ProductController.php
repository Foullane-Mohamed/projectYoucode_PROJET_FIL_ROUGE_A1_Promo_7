<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Models\Product;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    private $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function index()
    {
        $products = $this->productRepository->all();
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function show($id)
    {
        $product = $this->productRepository->find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $product
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'stock' => 'required|integer|min:0',
            'images' => 'sometimes|array',
            'featured' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        
        $product = $this->productRepository->create($validated);
        
        return response()->json([
            'success' => true,
            'data' => $product
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $product = $this->productRepository->find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'price' => 'sometimes|numeric|min:0',
            'category_id' => 'sometimes|exists:categories,id',
            'stock' => 'sometimes|integer|min:0',
            'images' => 'sometimes|array',
            'featured' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
        ]);
        
        if (isset($validated['name'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }
        
        $this->productRepository->update($validated, $id);
        
        return response()->json([
            'success' => true,
            'data' => $this->productRepository->find($id)
        ]);
    }

    public function destroy($id)
    {
        $product = $this->productRepository->find($id);
        
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }
        
        $this->productRepository->delete($id);
        
        return response()->json([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);
    }

    public function search(Request $request)
    {
        $term = $request->input('q');
        $products = $this->productRepository->search($term);
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function filter(Request $request)
    {
        $filters = $request->only(['category_id', 'min_price', 'max_price']);
        $products = $this->productRepository->filter($filters);
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function getFeatured()
    {
        $products = $this->productRepository->getFeatured();
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    public function getByCategory($categoryId)
    {
        $products = $this->productRepository->getByCategory($categoryId);
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }
}
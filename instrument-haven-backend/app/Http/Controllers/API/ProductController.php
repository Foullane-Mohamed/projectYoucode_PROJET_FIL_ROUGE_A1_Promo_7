<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\ProductRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    protected $productRepository;

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function index()
    {
        $products = $this->productRepository->all();
        return response()->json(['data' => $products->load('category', 'tags')]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['images', 'tags']);
        
        if ($request->hasFile('images')) {
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $images[] = $path;
            }
            $data['images'] = $images;
        }

        $product = $this->productRepository->create($data);

        if ($request->has('tags')) {
            $product->tags()->attach($request->tags);
        }

        return response()->json(['message' => 'Product created successfully', 'data' => $product], 201);
    }

    public function show($id)
    {
        $product = $this->productRepository->find($id);
        return response()->json(['data' => $product->load('category', 'tags')]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->except(['images', 'tags']);
        $product = $this->productRepository->find($id);
        
        if ($request->hasFile('images')) {
            // Delete existing images
            if (!empty($product->images)) {
                foreach ($product->images as $image) {
                    Storage::disk('public')->delete($image);
                }
            }
            
            $images = [];
            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $images[] = $path;
            }
            $data['images'] = $images;
        }

        $product = $this->productRepository->update($data, $id);

        if ($request->has('tags')) {
            $product->tags()->sync($request->tags);
        }

        return response()->json(['message' => 'Product updated successfully', 'data' => $product]);
    }

    public function destroy($id)
    {
        $product = $this->productRepository->find($id);
        
        // Delete product images
        if (!empty($product->images)) {
            foreach ($product->images as $image) {
                Storage::disk('public')->delete($image);
            }
        }
        
        $this->productRepository->delete($id);
        return response()->json(['message' => 'Product deleted successfully']);
    }

    public function getProductsByCategory($categoryId)
    {
        $products = $this->productRepository->getProductsByCategory($categoryId);
        return response()->json(['data' => $products->load('category', 'tags')]);
    }

    public function getProductsByTag($tagId)
    {
        $products = $this->productRepository->getProductsByTag($tagId);
        return response()->json(['data' => $products->load('category', 'tags')]);
    }

    public function searchProducts(Request $request)
    {
        $query = $request->input('query');
        if (empty($query)) {
            return response()->json(['data' => []]);
        }
        $products = $this->productRepository->searchProducts($query);
        return response()->json(['data' => $products->load('category', 'tags')]);
    }
}
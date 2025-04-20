<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Display a listing of the products.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 15);
        $products = $this->productRepository->getWithFilters($request->all(), $perPage);

        // Consistent response format matching frontend expectations
        return response()->json([
            'status' => 'success',
            'data' => [
                'products' => $products->items(),
                'pagination' => [
                    'total' => $products->total(),
                    'per_page' => $products->perPage(),
                    'current_page' => $products->currentPage(),
                    'last_page' => $products->lastPage(),
                    'from' => $products->firstItem(),
                    'to' => $products->lastItem()
                ]
            ]
        ]);
    }

    /**
     * Display the specified product.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $product = $this->productRepository->getWithDetails($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'product' => $product
            ]
        ]);
    }

    /**
     * Store a newly created product in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'category_id' => 'required|exists:categories,id',
                'images' => 'nullable|array',
                'specifications' => 'nullable',
                'attributes' => 'nullable',
                'brand' => 'nullable|string',
                'is_active' => 'nullable|boolean',
                'on_sale' => 'nullable|boolean',
                'sale_price' => 'nullable|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();
            
            // Ensure specifications and attributes are properly handled
            if (isset($data['specifications']) && is_string($data['specifications'])) {
                $data['specifications'] = json_decode($data['specifications'], true);
            }
            
            if (isset($data['attributes']) && is_string($data['attributes'])) {
                $data['attributes'] = json_decode($data['attributes'], true);
            }
            
            // Set default values
            $data['slug'] = Str::slug($data['name']);
            $data['is_active'] = $data['is_active'] ?? true;
            $data['on_sale'] = $data['on_sale'] ?? false;
            
            // Use the first image as thumbnail if available
            if (isset($data['images']) && !empty($data['images'])) {
                $data['thumbnail'] = $data['images'][0];
            }
            
            // Create product
            $product = $this->productRepository->create($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Product created successfully',
                'data' => [
                    'product' => $product
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while creating the product',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Update the specified product in storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'price' => 'sometimes|required|numeric|min:0',
                'stock' => 'sometimes|required|integer|min:0',
                'category_id' => 'sometimes|required|exists:categories,id',
                'images' => 'nullable|array',
                'specifications' => 'nullable',
                'attributes' => 'nullable',
                'brand' => 'nullable|string',
                'is_active' => 'nullable|boolean',
                'on_sale' => 'nullable|boolean',
                'sale_price' => 'nullable|numeric|min:0',
                'replace_images' => 'nullable|boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if product exists
            $product = $this->productRepository->find($id);

            if (!$product) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Product not found'
                ], 404);
            }

            $data = $request->all();
            
            // Update slug if name is changed
            if (isset($data['name']) && $data['name'] !== $product->name) {
                $data['slug'] = Str::slug($data['name']);
            }
            
            // Handle images from JSON
            if ($request->has('images')) {
                // Check if we should replace or append images
                if ($request->input('replace_images', false)) {
                    // Just use the provided images array
                    if (!empty($data['images'])) {
                        $data['thumbnail'] = $data['images'][0];
                    }
                } else {
                    // If product already has images, we'll append to them
                    if (isset($product->images) && is_array($product->images)) {
                        $data['images'] = array_merge($product->images, $data['images']);
                    }
                }
            }
            
            // Make sure specifications and attributes are arrays
            if (isset($data['specifications']) && is_string($data['specifications'])) {
                $data['specifications'] = json_decode($data['specifications'], true);
            }
            
            if (isset($data['attributes']) && is_string($data['attributes'])) {
                $data['attributes'] = json_decode($data['attributes'], true);
            }
            
            // Update product
            $this->productRepository->update($id, $data);
            $product = $this->productRepository->find($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Product updated successfully',
                'data' => [
                    'product' => $product
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating the product',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }

    /**
     * Remove the specified product from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        // Check if product exists
        $product = $this->productRepository->find($id);

        if (!$product) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }

        // Delete product
        $this->productRepository->delete($id);

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully'
        ]);
    }
}

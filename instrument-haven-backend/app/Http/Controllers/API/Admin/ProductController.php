<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\TagRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected $productRepository;
    protected $tagRepository;

    public function __construct(
        ProductRepositoryInterface $productRepository,
        TagRepositoryInterface $tagRepository
    ) {
        $this->productRepository = $productRepository;
        $this->tagRepository = $tagRepository;
    }

    /**
     * Create a new product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255|unique:products',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'required|integer|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'images' => 'nullable|array',
            'specifications' => 'nullable|array',
            'attributes' => 'nullable|array',
            'is_active' => 'nullable|boolean',
            'on_sale' => 'nullable|boolean',
            'sale_price' => 'nullable|numeric|min:0',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $productData = $request->except('tag_ids');
        $productData['slug'] = Str::slug($request->name);
        
        // Set thumbnail to the first image
        if (isset($productData['images']) && !empty($productData['images'])) {
            $productData['thumbnail'] = $productData['images'][0];
        }
        
        $product = $this->productRepository->create($productData);
        
        // Sync tags if provided
        if ($request->has('tag_ids')) {
            $this->tagRepository->syncForProduct($product->id, $request->tag_ids);
        }
        
        // Load relationships
        $product->load(['category', 'tags']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully',
            'data' => [
                'product' => $product
            ]
        ], 201);
    }

    /**
     * Update the specified product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255|unique:products,name,' . $id,
            'description' => 'string',
            'price' => 'numeric|min:0',
            'stock' => 'integer|min:0',
            'category_id' => 'integer|exists:categories,id',
            'brand' => 'nullable|string|max:255',
            'images' => 'nullable|array',
            'specifications' => 'nullable|array',
            'attributes' => 'nullable|array',
            'is_active' => 'boolean',
            'on_sale' => 'boolean',
            'sale_price' => 'nullable|numeric|min:0',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $productData = $request->except('tag_ids');
            
            // Update slug if name is provided
            if (isset($productData['name'])) {
                $productData['slug'] = Str::slug($productData['name']);
            }
            
            // Set thumbnail to the first image if images are provided
            if (isset($productData['images']) && !empty($productData['images'])) {
                $productData['thumbnail'] = $productData['images'][0];
            }
            
            $this->productRepository->update($productData, $id);
            
            // Sync tags if provided
            if ($request->has('tag_ids')) {
                $this->tagRepository->syncForProduct($id, $request->tag_ids);
            }
            
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
                'message' => 'Product not found'
            ], 404);
        }
    }

    /**
     * Remove the specified product.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $this->productRepository->delete($id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Product deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], 404);
        }
    }
}

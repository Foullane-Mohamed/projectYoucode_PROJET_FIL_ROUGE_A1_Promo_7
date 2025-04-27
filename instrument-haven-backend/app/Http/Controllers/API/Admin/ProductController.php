<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected $productRepository;

    public function __construct(
        ProductRepositoryInterface $productRepository
    ) {
        $this->productRepository = $productRepository;
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
            'images.*' => 'nullable|file|image|max:2048',
            'is_active' => 'nullable|boolean',
            'on_sale' => 'nullable|boolean',
            'sale_price' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $productData = $request->except(['images']);
        $productData['slug'] = Str::slug($request->name);
        
        // Handle image uploads
        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                // Check if we should use local storage
                $useLocalStorage = $request->has('use_local_storage') && $request->use_local_storage === 'true';
                
                // Get original filename if provided
                $originalFilename = $request->has('image_names') && isset($request->image_names[$index]) 
                    ? $request->image_names[$index] 
                    : $image->getClientOriginalName();
                
                // Use original filename if requested, otherwise generate a timestamp-based name
                $filename = $useLocalStorage 
                    ? $originalFilename 
                    : time() . '_' . $image->getClientOriginalName();
                
                // Remove spaces and special characters in filename
                $filename = preg_replace('/[^a-zA-Z0-9_.-]/', '-', $filename);
                
                // Store the file in public/storage
                $image->storeAs('public/products', $filename);
                
                // If using local storage, also copy to public/images/products
                if ($useLocalStorage) {
                    // Create directory if it doesn't exist
                    $publicDir = public_path('images/products');
                    if (!file_exists($publicDir)) {
                        mkdir($publicDir, 0755, true);
                    }
                    
                    // Copy file to public directory
                    $image->move($publicDir, $filename);
                }
                
                // Remove the 'products/' prefix when saving to DB
                $images[] = basename($filename);
            }
            $productData['images'] = $images;
            // Set thumbnail to the first image
            if (!empty($images)) {
                $productData['thumbnail'] = $images[0];
            }
        }
        
        $product = $this->productRepository->create($productData);
        
        // Load relationships
        $product->load(['category']);
        
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
            'sale_price' => 'nullable|numeric|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $productData = $request->except(['images']);
            
            // Update slug if name is provided
            if (isset($productData['name'])) {
                $productData['slug'] = Str::slug($productData['name']);
            }
            
            // Handle image uploads
            $images = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    // Check if we should use local storage
                    $useLocalStorage = $request->has('use_local_storage') && $request->use_local_storage === 'true';
                    
                    // Get original filename if provided
                    $originalFilename = $request->has('image_names') && isset($request->image_names[$index]) 
                        ? $request->image_names[$index] 
                        : $image->getClientOriginalName();
                    
                    // Use original filename if requested, otherwise generate a timestamp-based name
                    $filename = $useLocalStorage 
                        ? $originalFilename 
                        : time() . '_' . $image->getClientOriginalName();
                    
                    // Remove spaces and special characters in filename
                    $filename = preg_replace('/[^a-zA-Z0-9_.-]/', '-', $filename);
                    
                    // Store the file in public/storage
                    $image->storeAs('public/products', $filename);
                    
                    // If using local storage, also copy to public/images/products
                    if ($useLocalStorage) {
                        // Create directory if it doesn't exist
                        $publicDir = public_path('images/products');
                        if (!file_exists($publicDir)) {
                            mkdir($publicDir, 0755, true);
                        }
                        
                        // Copy file to public directory
                        $image->move($publicDir, $filename);
                    }
                    
                    // Remove the 'products/' prefix when saving to DB
                    $images[] = basename($filename);
                }
                
                // If replace_images flag is set, update images array
                if ($request->has('replace_images') && $request->replace_images === 'true') {
                    $productData['images'] = $images;
                    // Set thumbnail to the first image
                    if (!empty($images)) {
                        $productData['thumbnail'] = $images[0];
                    }
                } else {
                    // Otherwise append to existing images
                    $product = $this->productRepository->find($id);
                    $existingImages = $product->images ?? [];
                    $productData['images'] = array_merge($existingImages, $images);
                    
                    // If no thumbnail exists, set it to the first image
                    if (empty($product->thumbnail) && !empty($productData['images'])) {
                        $productData['thumbnail'] = $productData['images'][0];
                    }
                }
            } elseif ($request->has('keep_existing_images') && $request->keep_existing_images === 'true') {
                // Maintain existing images
                $product = $this->productRepository->find($id);
                $existingImages = $product->images ?? [];
                
                // If there are existing images in the request, use those
                if ($request->has('existing_images')) {
                    $productData['images'] = $request->existing_images;
                    if (!empty($request->existing_images)) {
                        $productData['thumbnail'] = $request->existing_images[0];
                    }
                } else {
                    $productData['images'] = $existingImages;
                }
            }
            
            $this->productRepository->update($productData, $id);
            
            
            
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

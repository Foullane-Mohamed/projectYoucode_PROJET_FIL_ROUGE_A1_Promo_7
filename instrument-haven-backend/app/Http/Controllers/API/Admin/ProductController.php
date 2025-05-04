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
        
        $images = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $useLocalStorage = $request->has('use_local_storage') && $request->use_local_storage === 'true';
                
                $originalFilename = $request->has('image_names') && isset($request->image_names[$index]) 
                    ? $request->image_names[$index] 
                    : $image->getClientOriginalName();
                
                $filename = $useLocalStorage 
                    ? $originalFilename 
                    : time() . '_' . Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $image->getClientOriginalExtension();
                
                $filename = preg_replace('/[^a-zA-Z0-9_.-]/', '-', $filename);
                
                $path = $image->storeAs('products', $filename, 'public');
                
                if (!isset($productData['image_url']) && $index === 0) {
                    $productData['image_url'] = $path;
                }
                
                \Log::info('Product image uploaded:', [
                    'product' => $request->name,
                    'filename' => $filename,
                    'path' => $path,
                    'image_url' => $productData['image_url'] ?? 'not set'
                ]);
                
                if ($useLocalStorage) {
                    $publicDir = public_path('images/products');
                    if (!file_exists($publicDir)) {
                        mkdir($publicDir, 0755, true);
                    }
                    
                    $image->move($publicDir, $filename);
                }
                
                $images[] = basename($filename);
            }
            $productData['images'] = $images;
            if (!empty($images)) {
                $productData['thumbnail'] = $images[0];
            }
        }
        
        $product = $this->productRepository->create($productData);
        
        $product->load(['category']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully',
            'data' => [
                'product' => $product
            ]
        ], 201);
    }

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
            
            if (isset($productData['name'])) {
                $productData['slug'] = Str::slug($productData['name']);
            }
            
            $images = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $useLocalStorage = $request->has('use_local_storage') && $request->use_local_storage === 'true';
                    
                    $originalFilename = $request->has('image_names') && isset($request->image_names[$index]) 
                        ? $request->image_names[$index] 
                        : $image->getClientOriginalName();
                    
                    $filename = $useLocalStorage 
                        ? $originalFilename 
                        : time() . '_' . Str::slug(pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $image->getClientOriginalExtension();
                    
                    $filename = preg_replace('/[^a-zA-Z0-9_.-]/', '-', $filename);
                    
                    $path = $image->storeAs('products', $filename, 'public');
                    
                    if (!isset($productData['image_url']) && $index === 0) {
                        $productData['image_url'] = $path;
                    }
                    
                    \Log::info('Product image uploaded:', [
                        'product_id' => $id,
                        'filename' => $filename,
                        'path' => $path,
                        'image_url' => $productData['image_url'] ?? 'not set'
                    ]);
                    
                    if ($useLocalStorage) {
                        $publicDir = public_path('images/products');
                        if (!file_exists($publicDir)) {
                            mkdir($publicDir, 0755, true);
                        }
                        
                        $image->move($publicDir, $filename);
                    }
                    
                    $images[] = basename($filename);
                }
                
                if ($request->has('replace_images') && $request->replace_images === 'true') {
                    $productData['images'] = $images;
                    if (!empty($images)) {
                        $productData['thumbnail'] = $images[0];
                    }
                } else {
                    $product = $this->productRepository->find($id);
                    $existingImages = $product->images ?? [];
                    $productData['images'] = array_merge($existingImages, $images);
                    
                    if (empty($product->thumbnail) && !empty($productData['images'])) {
                        $productData['thumbnail'] = $productData['images'][0];
                    }
                }
            } elseif ($request->has('keep_existing_images') && $request->keep_existing_images === 'true') {
                $product = $this->productRepository->find($id);
                $existingImages = $product->images ?? [];
                
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

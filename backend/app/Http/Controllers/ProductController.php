<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $query = Product::with('subcategory.category');
            
            // Apply filters if provided
            if ($request->has('subcategory_id')) {
                $query->where('subcategory_id', $request->subcategory_id);
            }
            
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            // Filter by stock level
            if ($request->has('stock')) {
                $stockFilter = $request->stock;
                
                if ($stockFilter === 'low') {
                    $threshold = $request->input('threshold', 10);
                    $query->where('stock', '<', $threshold);
                } elseif ($stockFilter === 'out') {
                    $query->where('stock', 0);
                } elseif ($stockFilter === 'in') {
                    $query->where('stock', '>', 0);
                }
            }
            
            // Search by name or description
            if ($request->has('search')) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('description', 'like', "%{$searchTerm}%");
                });
            }
            
            // Price range filter
            if ($request->has('min_price')) {
                $query->where('price', '>=', $request->min_price);
            }
            
            if ($request->has('max_price')) {
                $query->where('price', '<=', $request->max_price);
            }
            
            // Apply sorting
            $sortField = $request->input('sort_field', 'created_at');
            $sortDirection = $request->input('sort_direction', 'desc');
            $query->orderBy($sortField, $sortDirection);
            
            // Apply limit if provided
            if ($request->has('limit')) {
                $products = $query->limit($request->limit)->get();
            } else {
                // Paginate results
                $perPage = $request->input('per_page', 15);
                $products = $query->paginate($perPage);
            }
            
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch products: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Store a newly created product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'subcategory_id' => 'required|exists:sub_categories,id',
                'image' => 'nullable|image|max:2048',
                'status' => 'in:active,inactive',
            ]);
            
            $data = $request->all();
            
            // Handle image upload
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/products', $filename);
                $data['image'] = $filename;
            }
            
            $product = Product::create($data);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Product created successfully',
                'data' => $product
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create product: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Display the specified product.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $product = Product::with(['subcategory.category', 'comments.user'])
                ->findOrFail($id);
            
            return response()->json([
                'status' => 'success',
                'data' => $product
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Product not found'
            ], Response::HTTP_NOT_FOUND);
        }
    }
    
    /**
     * Update the specified product in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'name' => 'string|max:255',
                'description' => 'string',
                'price' => 'numeric|min:0',
                'stock' => 'integer|min:0',
                'subcategory_id' => 'exists:sub_categories,id',
                'image' => 'nullable|image|max:2048',
                'status' => 'in:active,inactive',
            ]);
            
            $product = Product::findOrFail($id);
            $data = $request->all();
            
            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image) {
                    Storage::delete('public/products/' . $product->image);
                }
                
                $file = $request->file('image');
                $filename = time() . '.' . $file->getClientOriginalExtension();
                $file->storeAs('public/products', $filename);
                $data['image'] = $filename;
            }
            
            $product->update($data);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Product updated successfully',
                'data' => $product
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update product: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Remove the specified product from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $product = Product::findOrFail($id);
            
            // Delete product image if exists
            if ($product->image) {
                Storage::delete('public/products/' . $product->image);
            }
            
            $product->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Product deleted successfully'
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete product: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Search for products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        try {
            $request->validate([
                'term' => 'required|string|min:3',
            ]);
            
            $term = $request->term;
            
            $products = Product::where('name', 'like', "%{$term}%")
                ->orWhere('description', 'like', "%{$term}%")
                ->with('subcategory')
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to search products: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get latest products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function latest(Request $request)
    {
        try {
            $limit = $request->input('limit', 8);
            
            $products = Product::where('status', 'active')
                ->orderBy('created_at', 'desc')
                ->limit($limit)
                ->with('subcategory')
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch latest products: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get products by subcategory.
     *
     * @param  int  $subcategoryId
     * @return \Illuminate\Http\Response
     */
    public function bySubcategory($subcategoryId)
    {
        try {
            $products = Product::where('subcategory_id', $subcategoryId)
                ->where('status', 'active')
                ->with('subcategory')
                ->paginate(15);
            
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch products: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    
    /**
     * Get products in a price range.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function priceRange(Request $request)
    {
        try {
            $request->validate([
                'min' => 'required|numeric|min:0',
                'max' => 'required|numeric|gt:min',
            ]);
            
            $min = $request->min;
            $max = $request->max;
            
            $products = Product::whereBetween('price', [$min, $max])
                ->where('status', 'active')
                ->with('subcategory')
                ->paginate(15);
            
            return response()->json([
                'status' => 'success',
                'data' => $products
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to fetch products: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
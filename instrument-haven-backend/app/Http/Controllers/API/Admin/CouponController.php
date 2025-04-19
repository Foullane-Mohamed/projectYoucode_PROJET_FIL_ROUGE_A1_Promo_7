<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CouponController extends Controller
{
    /**
     * Display a listing of coupons.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        // Verify admin permission
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $perPage = $request->input('per_page', 15);
        $query = Coupon::query();
        
        // Apply search filter
        if ($request->has('search')) {
            $query->where('code', 'like', "%{$request->search}%");
        }
        
        // Apply status filter
        if ($request->has('status')) {
            $status = $request->status;
            
            if ($status === 'active') {
                $query->where('is_active', true)
                    ->where(function ($q) {
                        $q->whereNull('start_date')
                          ->orWhere('start_date', '<=', now());
                    })
                    ->where(function ($q) {
                        $q->whereNull('end_date')
                          ->orWhere('end_date', '>=', now());
                    })
                    ->where(function ($q) {
                        $q->where('usage_limit', 0)
                          ->orWhere('usage_count', '<', 'usage_limit');
                    });
            } elseif ($status === 'expired') {
                $query->where('end_date', '<', now());
            } elseif ($status === 'upcoming') {
                $query->where('start_date', '>', now());
            }
        }
        
        $coupons = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => [
                'coupons' => $coupons->items(),
                'pagination' => [
                    'total' => $coupons->total(),
                    'per_page' => $coupons->perPage(),
                    'current_page' => $coupons->currentPage(),
                    'last_page' => $coupons->lastPage(),
                    'from' => $coupons->firstItem(),
                    'to' => $coupons->lastItem()
                ]
            ]
        ]);
    }

    /**
     * Store a newly created coupon.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        // Verify admin permission
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:coupons',
            'type' => 'required|string|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'usage_limit' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Create coupon
        $coupon = Coupon::create([
            'code' => $request->code,
            'type' => $request->type,
            'discount' => $request->value,
            'min_purchase' => $request->min_purchase,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'usage_limit' => $request->usage_limit ?? 0,
            'usage_count' => 0,
            'description' => $request->description,
            'is_active' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Coupon created successfully',
            'data' => [
                'coupon' => $coupon
            ]
        ], 201);
    }

    /**
     * Update the specified coupon.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        // Verify admin permission
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|required|string|max:50|unique:coupons,code,' . $id,
            'type' => 'sometimes|required|string|in:percentage,fixed',
            'value' => 'sometimes|required|numeric|min:0',
            'min_purchase' => 'sometimes|required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'usage_limit' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Check if coupon exists
        $coupon = Coupon::find($id);

        if (!$coupon) {
            return response()->json([
                'status' => 'error',
                'message' => 'Coupon not found'
            ], 404);
        }

        // Update coupon
        if (isset($request->code)) {
            $coupon->code = $request->code;
        }
        if (isset($request->type)) {
            $coupon->type = $request->type;
        }
        if (isset($request->value)) {
            $coupon->discount = $request->value;
        }
        if (isset($request->min_purchase)) {
            $coupon->min_purchase = $request->min_purchase;
        }
        if (isset($request->start_date)) {
            $coupon->start_date = $request->start_date;
        }
        if (isset($request->end_date)) {
            $coupon->end_date = $request->end_date;
        }
        if (isset($request->usage_limit)) {
            $coupon->usage_limit = $request->usage_limit;
        }
        if (isset($request->description)) {
            $coupon->description = $request->description;
        }
        if (isset($request->is_active)) {
            $coupon->is_active = $request->is_active;
        }

        $coupon->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Coupon updated successfully',
            'data' => [
                'coupon' => $coupon
            ]
        ]);
    }

    /**
     * Remove the specified coupon.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Request $request, $id)
    {
        // Verify admin permission
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized'
            ], 403);
        }

        // Check if coupon exists
        $coupon = Coupon::find($id);

        if (!$coupon) {
            return response()->json([
                'status' => 'error',
                'message' => 'Coupon not found'
            ], 404);
        }

        // Delete coupon
        $coupon->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Coupon deleted successfully'
        ]);
    }
}

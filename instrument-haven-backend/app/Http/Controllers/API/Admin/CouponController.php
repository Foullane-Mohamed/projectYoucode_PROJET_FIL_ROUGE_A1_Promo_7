<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\CouponRepositoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CouponController extends Controller
{
    protected $couponRepository;

    public function __construct(CouponRepositoryInterface $couponRepository)
    {
        $this->couponRepository = $couponRepository;
    }


    public function index()
    {
        $coupons = $this->couponRepository->all();
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'coupons' => $coupons
            ]
        ]);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:coupons',
            'discount_type' => 'required|string|in:percentage,fixed',
            'discount_value' => 'required|numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'starts_at' => 'required|date',
            'expires_at' => 'required|date|after:starts_at',
            'is_active' => 'nullable|boolean',
            'usage_limit' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $couponData = $request->all();
        $couponData['usage_count'] = 0;
        
        $coupon = $this->couponRepository->create($couponData);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Coupon created successfully',
            'data' => [
                'coupon' => $coupon
            ]
        ], 201);
    }

  
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'string|max:50|unique:coupons,code,' . $id,
            'discount_type' => 'string|in:percentage,fixed',
            'discount_value' => 'numeric|min:0',
            'min_order_amount' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'starts_at' => 'date',
            'expires_at' => 'date|after:starts_at',
            'is_active' => 'boolean',
            'usage_limit' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->couponRepository->update($request->all(), $id);
            
            $coupon = $this->couponRepository->find($id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Coupon updated successfully',
                'data' => [
                    'coupon' => $coupon
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Coupon not found'
            ], 404);
        }
    }


    public function destroy($id)
    {
        try {
            $this->couponRepository->delete($id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Coupon deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Coupon not found'
            ], 404);
        }
    }
}

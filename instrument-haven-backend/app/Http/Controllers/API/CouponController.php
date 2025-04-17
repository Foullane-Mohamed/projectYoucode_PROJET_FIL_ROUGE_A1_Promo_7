<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Repositories\CouponRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CouponController extends Controller
{
    protected $couponRepository;

    public function __construct(CouponRepository $couponRepository)
    {
        $this->couponRepository = $couponRepository;
    }

    public function index()
    {
        $coupons = $this->couponRepository->all();
        return response()->json(['data' => $coupons]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:coupons',
            'discount' => 'required|numeric|min:0',
            'type' => 'required|in:percentage,fixed',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $coupon = $this->couponRepository->create($request->all());
        return response()->json(['message' => 'Coupon created successfully', 'data' => $coupon], 201);
    }

    public function show($id)
    {
        $coupon = $this->couponRepository->find($id);
        return response()->json(['data' => $coupon]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|unique:coupons,code,' . $id,
            'discount' => 'required|numeric|min:0',
            'type' => 'required|in:percentage,fixed',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $coupon = $this->couponRepository->update($request->all(), $id);
        return response()->json(['message' => 'Coupon updated successfully', 'data' => $coupon]);
    }

    public function destroy($id)
    {
        $this->couponRepository->delete($id);
        return response()->json(['message' => 'Coupon deleted successfully']);
    }

    public function validateCoupon(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $coupon = $this->couponRepository->findByCode($request->code);

        if (!$coupon) {
            return response()->json(['valid' => false, 'message' => 'Coupon not found']);
        }

        if (!$coupon->is_active) {
            return response()->json(['valid' => false, 'message' => 'Coupon is not active']);
        }

        if ($coupon->starts_at && $coupon->starts_at > now()) {
            return response()->json(['valid' => false, 'message' => 'Coupon is not yet active']);
        }

        if ($coupon->expires_at && $coupon->expires_at < now()) {
            return response()->json(['valid' => false, 'message' => 'Coupon has expired']);
        }

        return response()->json([
            'valid' => true,
            'message' => 'Coupon is valid',
            'data' => [
                'discount' => $coupon->discount,
                'type' => $coupon->type,
            ],
        ]);
    }
}
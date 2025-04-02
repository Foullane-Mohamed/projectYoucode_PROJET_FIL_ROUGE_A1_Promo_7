<?php

namespace App\Http\Controllers;

use App\Http\Requests\CouponRequest;
use App\Services\CouponService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class CouponController extends Controller
{
    protected $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }

    /**
     * Display a listing of the coupons.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $coupons = $this->couponService->getAllCoupons();
            return response()->json([
                'status' => 'success',
                'data' => $coupons
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created coupon in storage.
     *
     * @param  \App\Http\Requests\CouponRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CouponRequest $request)
    {
        try {
            $coupon = $this->couponService->createCoupon($request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Coupon created successfully',
                'data' => $coupon
            ], Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified coupon.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        try {
            $coupon = $this->couponService->getCouponById($id);
            return response()->json([
                'status' => 'success',
                'data' => $coupon
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified coupon in storage.
     *
     * @param  \App\Http\Requests\CouponRequest  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CouponRequest $request, $id)
    {
        try {
            $coupon = $this->couponService->updateCoupon($id, $request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Coupon updated successfully',
                'data' => $coupon
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified coupon from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $this->couponService->deleteCoupon($id);
            return response()->json([
                'status' => 'success',
                'message' => 'Coupon deleted successfully'
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get active coupons.
     *
     * @return \Illuminate\Http\Response
     */
    public function active()
    {
        try {
            $coupons = $this->couponService->getActiveCoupons();
            return response()->json([
                'status' => 'success',
                'data' => $coupons
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Validate a coupon code.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function validate(Request $request)
    {
        try {
            $request->validate([
                'code' => 'required|string|max:50',
            ]);
            
            $coupon = $this->couponService->validateCoupon($request->input('code'));
            
            if (!$coupon) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid or expired coupon code'
                ], Response::HTTP_NOT_FOUND);
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Coupon is valid',
                'data' => $coupon
            ], Response::HTTP_OK);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
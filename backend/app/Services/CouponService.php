<?php

namespace App\Services;

use App\Repositories\Interfaces\CouponRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Log;

class CouponService
{
    protected $couponRepository;

    public function __construct(CouponRepositoryInterface $couponRepository)
    {
        $this->couponRepository = $couponRepository;
    }

    public function getAllCoupons()
    {
        return $this->couponRepository->all();
    }

    public function getCouponById(int $id)
    {
        return $this->couponRepository->findById($id);
    }

    public function createCoupon(array $attributes)
    {
        try {
            return $this->couponRepository->create($attributes);
        } catch (Exception $e) {
            Log::error('Error creating coupon: ' . $e->getMessage());
            throw new Exception('Unable to create coupon: ' . $e->getMessage());
        }
    }

    public function updateCoupon(int $id, array $attributes)
    {
        try {
            return $this->couponRepository->update($id, $attributes);
        } catch (Exception $e) {
            Log::error('Error updating coupon: ' . $e->getMessage());
            throw new Exception('Unable to update coupon: ' . $e->getMessage());
        }
    }

    public function deleteCoupon(int $id)
    {
        try {
            return $this->couponRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error deleting coupon: ' . $e->getMessage());
            throw new Exception('Unable to delete coupon: ' . $e->getMessage());
        }
    }

    public function getActiveCoupons()
    {
        return $this->couponRepository->getActiveCoupons();
    }

    public function validateCoupon(string $code)
    {
        return $this->couponRepository->validateCoupon($code);
    }

    public function calculateDiscount(float $total, int $couponId)
    {
        $coupon = $this->couponRepository->findById($couponId);
        
        if (!$coupon) {
            return $total;
        }
        
        if ($coupon->type === 'percentage') {
            $discount = ($total * $coupon->discount) / 100;
            return $total - $discount;
        } else { // fixed amount
            return $total - $coupon->discount;
        }
    }
}
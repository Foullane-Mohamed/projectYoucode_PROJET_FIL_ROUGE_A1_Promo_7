<?php

namespace App\Repositories;

use App\Models\Coupon;
use App\Repositories\Interfaces\CouponRepositoryInterface;
use App\Services\Interfaces\CouponServiceInterface;

class CouponRepository extends BaseRepository implements CouponRepositoryInterface
{
    protected $couponService;

    public function __construct(CouponServiceInterface $couponService)
    {
        parent::__construct();
        $this->couponService = $couponService;
    }


    public function setModel()
    {
        $this->model = new Coupon();
    }


    public function getActive()
    {
        return $this->model
            ->where('is_active', true)
            ->whereDate('starts_at', '<=', now())
            ->whereDate('expires_at', '>=', now())
            ->get();
    }

    public function findByCode($code)
    {
        return $this->model->where('code', $code)->first();
    }

    public function validateCoupon($code, $subtotal = null)
    {
        $coupon = $this->findByCode($code);
        
        if (!$coupon) {
            return false;
        }
        
        return $this->couponService->isValid($coupon, $subtotal);
    }
    

    public function incrementUsageCount($id)
    {
        $coupon = $this->find($id);
        $coupon->usage_count += 1;
        
        return $coupon->save();
    }
}

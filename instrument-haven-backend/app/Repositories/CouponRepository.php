<?php

namespace App\Repositories;

use App\Models\Coupon;
use App\Repositories\Interfaces\CouponRepositoryInterface;

class CouponRepository extends BaseRepository implements CouponRepositoryInterface
{
    /**
     * Set model
     */
    public function setModel()
    {
        $this->model = new Coupon();
    }

    /**
     * Get active coupons
     * 
     * @return mixed
     */
    public function getActive()
    {
        return $this->model
            ->where('is_active', true)
            ->whereDate('starts_at', '<=', now())
            ->whereDate('expires_at', '>=', now())
            ->get();
    }
    
    /**
     * Find coupon by code
     * 
     * @param string $code
     * @return mixed
     */
    public function findByCode($code)
    {
        return $this->model->where('code', $code)->first();
    }
    
    /**
     * Validate coupon
     * 
     * @param string $code
     * @param float $subtotal
     * @return mixed
     */
    public function validateCoupon($code, $subtotal = null)
    {
        $coupon = $this->findByCode($code);
        
        if (!$coupon) {
            return false;
        }
        
        return $coupon->isValid($subtotal);
    }
    
    /**
     * Increment usage count
     * 
     * @param int $id
     * @return mixed
     */
    public function incrementUsageCount($id)
    {
        $coupon = $this->find($id);
        $coupon->usage_count += 1;
        
        return $coupon->save();
    }
}

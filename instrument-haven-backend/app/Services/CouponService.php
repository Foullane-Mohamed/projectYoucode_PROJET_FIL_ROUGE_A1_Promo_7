<?php

namespace App\Services;

use App\Models\Coupon;
use App\Services\Interfaces\CouponServiceInterface;

class CouponService implements CouponServiceInterface
{

    public function isValid(Coupon $coupon, $subtotal = null)
    {
        if (!$coupon->is_active) {
            return false;
        }
        
        if ($coupon->starts_at > now() || $coupon->expires_at < now()) {
            return false;
        }
        
        if ($coupon->usage_limit && $coupon->usage_count >= $coupon->usage_limit) {
            return false;
        }
        
        if ($subtotal !== null && $coupon->min_order_amount && $subtotal < $coupon->min_order_amount) {
            return false;
        }
        
        return true;
    }
}

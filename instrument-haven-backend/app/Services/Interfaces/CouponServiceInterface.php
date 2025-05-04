<?php

namespace App\Services\Interfaces;

use App\Models\Coupon;

interface CouponServiceInterface
{

    public function isValid(Coupon $coupon, $subtotal = null);
}

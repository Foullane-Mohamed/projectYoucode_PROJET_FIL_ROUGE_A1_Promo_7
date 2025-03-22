<?php

namespace App\Repositories\Interfaces;

interface CouponRepositoryInterface extends BaseRepositoryInterface
{
    public function findByCode(string $code);
    public function getActiveCoupons();
    public function validateCoupon(string $code);
}
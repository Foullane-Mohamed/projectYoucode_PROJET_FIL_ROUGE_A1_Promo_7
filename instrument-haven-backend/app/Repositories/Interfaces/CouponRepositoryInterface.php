<?php

namespace App\Repositories\Interfaces;

interface CouponRepositoryInterface extends RepositoryInterface
{
    /**
     * Get active coupons
     * 
     * @return mixed
     */
    public function getActive();
    
    /**
     * Find coupon by code
     * 
     * @param string $code
     * @return mixed
     */
    public function findByCode($code);
    
    /**
     * Validate coupon
     * 
     * @param string $code
     * @param float $subtotal
     * @return mixed
     */
    public function validateCoupon($code, $subtotal = null);
    
    /**
     * Increment usage count
     * 
     * @param int $id
     * @return mixed
     */
    public function incrementUsageCount($id);
}

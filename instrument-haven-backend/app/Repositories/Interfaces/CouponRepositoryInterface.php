<?php

namespace App\Repositories\Interfaces;

interface CouponRepositoryInterface extends RepositoryInterface
{

    public function getActive();
    

    public function findByCode($code);

    public function validateCoupon($code, $subtotal = null);
    

    public function incrementUsageCount($id);
}

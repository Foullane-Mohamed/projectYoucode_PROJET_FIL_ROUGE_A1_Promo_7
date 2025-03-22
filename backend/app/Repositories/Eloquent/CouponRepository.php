<?php

namespace App\Repositories\Eloquent;

use App\Models\Coupon;
use App\Repositories\Interfaces\CouponRepositoryInterface;
use Carbon\Carbon;

class CouponRepository extends BaseRepository implements CouponRepositoryInterface
{
    public function __construct(Coupon $model)
    {
        parent::__construct($model);
    }

    public function findByCode(string $code)
    {
        return $this->model->where('code', $code)->first();
    }

    public function getActiveCoupons()
    {
        $now = Carbon::now();
        
        return $this->model->where('is_active', true)
                          ->where(function ($query) use ($now) {
                              $query->whereNull('start_date')
                                  ->orWhere('start_date', '<=', $now);
                          })
                          ->where(function ($query) use ($now) {
                              $query->whereNull('end_date')
                                  ->orWhere('end_date', '>=', $now);
                          })
                          ->get();
    }

    public function validateCoupon(string $code)
    {
        $now = Carbon::now();
        
        return $this->model->where('code', $code)
                          ->where('is_active', true)
                          ->where(function ($query) use ($now) {
                              $query->whereNull('start_date')
                                  ->orWhere('start_date', '<=', $now);
                          })
                          ->where(function ($query) use ($now) {
                              $query->whereNull('end_date')
                                  ->orWhere('end_date', '>=', $now);
                          })
                          ->first();
    }
}
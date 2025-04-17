<?php

namespace App\Repositories;

use App\Models\Coupon;

class CouponRepository extends BaseRepository
{
    public function __construct(Coupon $model)
    {
        parent::__construct($model);
    }

    public function getActiveCoupons()
    {
        return $this->model->where('is_active', true)
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->where(function ($query) {
                $query->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', now());
            })
            ->get();
    }

    public function findByCode($code)
    {
        return $this->model->where('code', $code)->first();
    }
}
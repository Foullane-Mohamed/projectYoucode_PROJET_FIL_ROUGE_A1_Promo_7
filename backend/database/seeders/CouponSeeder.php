<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'WELCOME10',
                'discount' => 10,
                'type' => 'percentage',
                'start_date' => Carbon::now()->subDays(30),
                'end_date' => Carbon::now()->addDays(60),
                'is_active' => true
            ],
            [
                'code' => 'SUMMER25',
                'discount' => 25,
                'type' => 'percentage',
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(90),
                'is_active' => true
            ],
            [
                'code' => 'FLAT50',
                'discount' => 50,
                'type' => 'fixed',
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(30),
                'is_active' => true
            ],
            [
                'code' => 'INSTRUMENTS15',
                'discount' => 15,
                'type' => 'percentage',
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(45),
                'is_active' => true
            ],
            [
                'code' => 'FREE15',
                'discount' => 15,
                'type' => 'fixed',
                'start_date' => Carbon::now()->subDays(10),
                'end_date' => Carbon::now()->addDays(20),
                'is_active' => true
            ],
            [
                'code' => 'EXPIRED20',
                'discount' => 20,
                'type' => 'percentage',
                'start_date' => Carbon::now()->subDays(60),
                'end_date' => Carbon::now()->subDays(30),
                'is_active' => false
            ],
            [
                'code' => 'HOLIDAY30',
                'discount' => 30,
                'type' => 'percentage',
                'start_date' => Carbon::now()->addDays(30),
                'end_date' => Carbon::now()->addDays(60),
                'is_active' => true
            ]
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }
    }
}
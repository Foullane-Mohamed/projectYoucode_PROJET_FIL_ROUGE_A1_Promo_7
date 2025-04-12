<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentMethods = [
            [
                'name' => 'Credit Card',
                'description' => 'Pay securely with your credit card',
                'is_active' => true
            ],
            [
                'name' => 'PayPal',
                'description' => 'Pay using your PayPal account',
                'is_active' => true
            ],
            [
                'name' => 'Bank Transfer',
                'description' => 'Pay directly from your bank account',
                'is_active' => true
            ],
            [
                'name' => 'Cash on Delivery',
                'description' => 'Pay when you receive your order',
                'is_active' => true
            ],
            [
                'name' => 'Stripe',
                'description' => 'Pay securely with Stripe payment gateway',
                'is_active' => true
            ],
            [
                'name' => 'Apple Pay',
                'description' => 'Pay using Apple Pay',
                'is_active' => false
            ],
            [
                'name' => 'Google Pay',
                'description' => 'Pay using Google Pay',
                'is_active' => false
            ]
        ];

        foreach ($paymentMethods as $method) {
            PaymentMethod::create($method);
        }
    }
}
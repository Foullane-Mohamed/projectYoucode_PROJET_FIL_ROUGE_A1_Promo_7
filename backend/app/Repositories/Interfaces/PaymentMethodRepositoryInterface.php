<?php

namespace App\Repositories\Interfaces;

interface PaymentMethodRepositoryInterface extends BaseRepositoryInterface
{
    public function findByName(string $name);
    public function getActivePaymentMethods();
}
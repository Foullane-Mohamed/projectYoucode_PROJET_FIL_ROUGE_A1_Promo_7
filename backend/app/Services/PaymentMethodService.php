<?php

namespace App\Services;

use App\Repositories\Interfaces\PaymentMethodRepositoryInterface;
use Exception;
use Illuminate\Support\Facades\Log;

class PaymentMethodService
{
    protected $paymentMethodRepository;

    public function __construct(PaymentMethodRepositoryInterface $paymentMethodRepository)
    {
        $this->paymentMethodRepository = $paymentMethodRepository;
    }

    public function getAllPaymentMethods()
    {
        return $this->paymentMethodRepository->all();
    }

    public function getPaymentMethodById(int $id)
    {
        return $this->paymentMethodRepository->findById($id);
    }

    public function createPaymentMethod(array $attributes)
    {
        try {
            return $this->paymentMethodRepository->create($attributes);
        } catch (Exception $e) {
            Log::error('Error creating payment method: ' . $e->getMessage());
            throw new Exception('Unable to create payment method: ' . $e->getMessage());
        }
    }

    public function updatePaymentMethod(int $id, array $attributes)
    {
        try {
            return $this->paymentMethodRepository->update($id, $attributes);
        } catch (Exception $e) {
            Log::error('Error updating payment method: ' . $e->getMessage());
            throw new Exception('Unable to update payment method: ' . $e->getMessage());
        }
    }

    public function deletePaymentMethod(int $id)
    {
        try {
            return $this->paymentMethodRepository->delete($id);
        } catch (Exception $e) {
            Log::error('Error deleting payment method: ' . $e->getMessage());
            throw new Exception('Unable to delete payment method: ' . $e->getMessage());
        }
    }

    public function getActivePaymentMethods()
    {
        return $this->paymentMethodRepository->getActivePaymentMethods();
    }
}
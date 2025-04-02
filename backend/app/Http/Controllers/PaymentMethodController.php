<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentMethodRequest;
use App\Services\PaymentMethodService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class PaymentMethodController extends Controller
{
    protected $paymentMethodService;

    /**
     * Constructor
     *
     * @param PaymentMethodService $paymentMethodService
     */
    public function __construct(PaymentMethodService $paymentMethodService)
    {
        $this->paymentMethodService = $paymentMethodService;
    }

    /**
     * Display a listing of the payment methods.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        try {
            $paymentMethods = $this->paymentMethodService->getAllPaymentMethods();
            return response()->json([
                'status' => 'success',
                'message' => 'Payment methods retrieved successfully',
                'data' => $paymentMethods
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve payment methods',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Store a newly created payment method in storage.
     *
     * @param PaymentMethodRequest $request
     * @return JsonResponse
     */
    public function store(PaymentMethodRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $paymentMethod = $this->paymentMethodService->createPaymentMethod($validated);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Payment method created successfully',
                'data' => $paymentMethod
            ], Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create payment method',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified payment method.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $paymentMethod = $this->paymentMethodService->getPaymentMethodById($id);
            
            if (!$paymentMethod) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment method not found'
                ], Response::HTTP_NOT_FOUND);
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Payment method retrieved successfully',
                'data' => $paymentMethod
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve payment method',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update the specified payment method in storage.
     *
     * @param PaymentMethodRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(PaymentMethodRequest $request, int $id): JsonResponse
    {
        try {
            $validated = $request->validated();
            $paymentMethod = $this->paymentMethodService->getPaymentMethodById($id);
            
            if (!$paymentMethod) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment method not found'
                ], Response::HTTP_NOT_FOUND);
            }
            
            $updatedPaymentMethod = $this->paymentMethodService->updatePaymentMethod($id, $validated);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Payment method updated successfully',
                'data' => $updatedPaymentMethod
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update payment method',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified payment method from storage.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $paymentMethod = $this->paymentMethodService->getPaymentMethodById($id);
            
            if (!$paymentMethod) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Payment method not found'
                ], Response::HTTP_NOT_FOUND);
            }
            
            $this->paymentMethodService->deletePaymentMethod($id);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Payment method deleted successfully'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete payment method',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get active payment methods.
     *
     * @return JsonResponse
     */
    public function getActive(): JsonResponse
    {
        try {
            $activePaymentMethods = $this->paymentMethodService->getActivePaymentMethods();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Active payment methods retrieved successfully',
                'data' => $activePaymentMethods
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve active payment methods',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}


<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Repositories\CouponRepository;
use App\Repositories\OrderRepository;
use App\Repositories\ProductRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected $orderRepository;
    protected $productRepository;
    protected $couponRepository;

    public function __construct(
        OrderRepository $orderRepository,
        ProductRepository $productRepository,
        CouponRepository $couponRepository
    ) {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->couponRepository = $couponRepository;
    }

    public function index()
    {
        $orders = $this->orderRepository->all();
        return response()->json(['data' => $orders]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
            'payment_method' => 'required|string',
            'coupon_code' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $total = 0;
        $items = [];

        foreach ($request->items as $item) {
            $product = $this->productRepository->find($item['product_id']);
            
            if ($product->stock < $item['quantity']) {
                return response()->json([
                    'message' => "Not enough stock for product: {$product->name}",
                ], 400);
            }

            $price = $product->price;
            $total += $price * $item['quantity'];
            
            $items[] = [
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $price,
            ];
            
            // Update product stock
            $product->stock -= $item['quantity'];
            $product->save();
        }

        $couponId = null;
        if ($request->has('coupon_code')) {
            $coupon = $this->couponRepository->findByCode($request->coupon_code);
            
            if ($coupon && $coupon->is_active && 
                (!$coupon->expires_at || $coupon->expires_at > now()) &&
                (!$coupon->starts_at || $coupon->starts_at <= now())) {
                
                if ($coupon->type === 'percentage') {
                    $total = $total * (1 - ($coupon->discount / 100));
                } else {
                    $total = max(0, $total - $coupon->discount);
                }
                
                $couponId = $coupon->id;
            }
        }

        $orderData = [
            'user_id' => $request->user()->id,
            'total' => $total,
            'status' => 'pending',
            'shipping_address' => $request->shipping_address,
            'payment_method' => $request->payment_method,
            'coupon_id' => $couponId,
        ];

        $order = $this->orderRepository->create($orderData);

        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }

        return response()->json([
            'message' => 'Order created successfully',
            'data' => $order->load('items.product'),
        ], 201);
    }

    public function show($id)
    {
        $order = $this->orderRepository->find($id);
        return response()->json(['data' => $order->load('items.product', 'user')]);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:pending,processing,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = $this->orderRepository->update($request->only('status'), $id);
        return response()->json(['message' => 'Order updated successfully', 'data' => $order]);
    }

    public function getOrdersByUser(Request $request)
    {
        $orders = $this->orderRepository->getOrdersByUser($request->user()->id);
        return response()->json(['data' => $orders->load('items.product')]);
    }

    public function getOrdersByStatus(Request $request)
    {
        $status = $request->input('status', 'pending');
        $orders = $this->orderRepository->getOrdersByStatus($status);
        return response()->json(['data' => $orders->load('items.product', 'user')]);
    }
}
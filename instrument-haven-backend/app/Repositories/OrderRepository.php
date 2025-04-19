<?php

namespace App\Repositories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    /**
     * OrderRepository constructor.
     *
     * @param Order $model
     */
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    /**
     * @inheritDoc
     */
    public function getWithFilters(array $filters, int $perPage = 15)
    {
        $query = $this->model->with('user:id,name');
        
        // Status filter
        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }
        
        // Search filter
        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhereHas('user', function($userQuery) use ($search) {
                      $userQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Date range filter
        if (isset($filters['from_date']) && $filters['from_date']) {
            $query->whereDate('created_at', '>=', $filters['from_date']);
        }
        if (isset($filters['to_date']) && $filters['to_date']) {
            $query->whereDate('created_at', '<=', $filters['to_date']);
        }
        
        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';
        
        $allowedSortFields = ['id', 'order_number', 'created_at', 'total', 'status'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }
        
        return $query->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function getWithDetails(int $id)
    {
        return $this->model
            ->with(['user:id,name,email', 'items.product:id,name,thumbnail', 'coupon'])
            ->find($id);
    }

    /**
     * @inheritDoc
     */
    public function getForUser(int $userId, array $filters = [], int $perPage = 10)
    {
        $query = $this->model->where('user_id', $userId);
        
        // Status filter
        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }
        
        // Sorting
        $query->orderBy('created_at', 'desc');
        
        return $query->paginate($perPage);
    }

    /**
     * @inheritDoc
     */
    public function createFromCart(int $userId, array $orderData)
    {
        try {
            DB::beginTransaction();
            
            // Get user's cart
            $cart = DB::table('carts')->where('user_id', $userId)->first();
            
            if (!$cart) {
                throw new \Exception('Cart not found');
            }
            
            // Create order
            $order = $this->model->create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $userId,
                'subtotal' => $cart->subtotal,
                'discount' => $cart->discount,
                'discount_code' => $cart->discount_code,
                'shipping_fee' => $orderData['shipping_fee'] ?? 0,
                'total' => $cart->total + ($orderData['shipping_fee'] ?? 0),
                'status' => 'pending',
                'shipping_address' => json_encode($orderData['shipping_address']),
                'shipping_address_json' => $orderData['shipping_address'],
                'payment_method' => $orderData['payment_method'],
                'payment_id' => $orderData['payment_intent_id'] ?? null,
                'payment_status' => 'paid',
                'shipping_method' => $orderData['shipping_method'],
            ]);
            
            // Get cart items
            $cartItems = DB::table('cart_items')
                ->where('cart_id', $cart->id)
                ->get();
            
            // Create order items
            foreach ($cartItems as $item) {
                $product = Product::find($item->product_id);
                
                if (!$product) {
                    throw new \Exception("Product with ID {$item->product_id} not found");
                }
                
                if ($product->stock < $item->quantity) {
                    throw new \Exception("Insufficient stock for product: {$product->name}");
                }
                
                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                    'thumbnail' => $product->thumbnail,
                ]);
                
                // Reduce product stock
                $product->stock -= $item->quantity;
                $product->save();
            }
            
            // If there's a coupon, increment its usage count
            if ($cart->discount_code) {
                DB::table('coupons')
                    ->where('code', $cart->discount_code)
                    ->increment('usage_count');
            }
            
            // Clear the cart
            DB::table('cart_items')->where('cart_id', $cart->id)->delete();
            DB::table('carts')
                ->where('id', $cart->id)
                ->update([
                    'subtotal' => 0,
                    'discount' => 0,
                    'discount_code' => null,
                    'total' => 0
                ]);
            
            DB::commit();
            
            return $order->load('items');
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @inheritDoc
     */
    public function cancelOrder(int $orderId, string $reason)
    {
        $order = $this->model->find($orderId);
        
        if (!$order) {
            return false;
        }
        
        if (!$order->isCancellable()) {
            return false;
        }
        
        try {
            DB::beginTransaction();
            
            // Update order status
            $order->status = 'cancelled';
            $order->cancel_reason = $reason;
            $order->save();
            
            // Restore product stock
            foreach ($order->items as $item) {
                $product = Product::find($item->product_id);
                
                if ($product) {
                    $product->stock += $item->quantity;
                    $product->save();
                }
            }
            
            // If there's a coupon, decrement its usage count
            if ($order->discount_code) {
                DB::table('coupons')
                    ->where('code', $order->discount_code)
                    ->decrement('usage_count');
            }
            
            DB::commit();
            
            return $order;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * @inheritDoc
     */
    public function updateStatus(int $orderId, array $data)
    {
        $order = $this->model->find($orderId);
        
        if (!$order) {
            return false;
        }
        
        $allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!isset($data['status']) || !in_array($data['status'], $allowedStatuses)) {
            return false;
        }
        
        // If changing to "cancelled" status, call cancelOrder instead
        if ($data['status'] === 'cancelled') {
            return $this->cancelOrder($orderId, $data['cancel_reason'] ?? 'Cancelled by admin');
        }
        
        $order->status = $data['status'];
        
        if (isset($data['tracking_number'])) {
            $order->tracking_number = $data['tracking_number'];
        }
        
        if (isset($data['carrier'])) {
            $order->carrier = $data['carrier'];
        }
        
        return $order->save();
    }

    /**
     * @inheritDoc
     */
    public function getStatistics(string $timeframe = 'month')
    {
        $now = Carbon::now();
        
        switch ($timeframe) {
            case 'today':
                $startDate = $now->copy()->startOfDay();
                $groupBy = "DATE_FORMAT(created_at, '%H:00')";
                break;
            case 'week':
                $startDate = $now->copy()->startOfWeek();
                $groupBy = "DATE(created_at)";
                break;
            case 'year':
                $startDate = $now->copy()->startOfYear();
                $groupBy = "DATE_FORMAT(created_at, '%Y-%m')";
                break;
            case 'all':
                $startDate = $now->copy()->subYears(10);
                $groupBy = "DATE_FORMAT(created_at, '%Y-%m')";
                break;
            case 'month':
            default:
                $startDate = $now->copy()->startOfMonth();
                $groupBy = "DATE(created_at)";
                break;
        }
        
        $endDate = $now->copy();
        
        // Total sales
        $totalSales = $this->model
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->where('status', '!=', 'cancelled')
            ->sum('total');
        
        // Order count
        $orderCount = $this->model
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->where('status', '!=', 'cancelled')
            ->count();
        
        // Average order value
        $averageOrder = $orderCount > 0 ? $totalSales / $orderCount : 0;
        
        // Chart data
        $chartData = $this->model
            ->where('created_at', '>=', $startDate)
            ->where('created_at', '<=', $endDate)
            ->where('status', '!=', 'cancelled')
            ->select(DB::raw("{$groupBy} as date"), DB::raw('SUM(total) as sales'))
            ->groupBy(DB::raw($groupBy))
            ->orderBy(DB::raw($groupBy))
            ->get();
        
        return [
            'total' => $totalSales,
            'count' => $orderCount,
            'average' => $averageOrder,
            'chart_data' => $chartData
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'order_number',
        'user_id',
        'subtotal',
        'discount',
        'discount_code',
        'shipping_fee',
        'total',
        'status',
        'tracking_number',
        'carrier',
        'shipping_address',
        'shipping_address_json',
        'payment_method',
        'payment_id',
        'payment_status',
        'shipping_method',
        'cancel_reason',
        'coupon_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'total' => 'decimal:2',
        'shipping_address_json' => 'array',
    ];

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the order.
     */
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    /**
     * Get the coupon for the order.
     */
    public function coupon()
    {
        return $this->belongsTo(Coupon::class);
    }

    /**
     * Get the user's name for the order.
     */
    public function getUserNameAttribute()
    {
        return $this->user->name;
    }

    /**
     * Get the items count for the order.
     */
    public function getItemsCountAttribute()
    {
        return $this->items->count();
    }

    /**
     * Check if the order is cancellable.
     */
    public function isCancellable()
    {
        return in_array($this->status, ['pending', 'processing']);
    }

    /**
     * Generate a unique order number.
     */
    public static function generateOrderNumber()
    {
        $date = now()->format('Ymd');
        $lastOrder = self::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $number = $lastOrder ? intval(substr($lastOrder->order_number, -3)) + 1 : 1;
        return 'ORD-' . $date . '-' . str_pad($number, 3, '0', STR_PAD_LEFT);
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('order_number')->after('id');
            $table->decimal('subtotal', 10, 2)->after('user_id');
            $table->decimal('discount', 10, 2)->default(0)->after('subtotal');
            $table->string('discount_code')->nullable()->after('discount');
            $table->decimal('shipping_fee', 10, 2)->default(0)->after('discount_code');
            $table->string('tracking_number')->nullable()->after('status');
            $table->string('carrier')->nullable()->after('tracking_number');
            $table->string('payment_status')->default('pending')->after('payment_method');
            $table->string('shipping_method')->nullable()->after('payment_status');
            $table->text('cancel_reason')->nullable()->after('shipping_method');
        });

        // Convert shipping_address from text to json format
        Schema::table('orders', function (Blueprint $table) {
            $table->json('shipping_address_json')->nullable()->after('shipping_address');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'order_number',
                'subtotal',
                'discount',
                'discount_code',
                'shipping_fee',
                'tracking_number',
                'carrier',
                'payment_status',
                'shipping_method',
                'cancel_reason',
                'shipping_address_json'
            ]);
        });
    }
};

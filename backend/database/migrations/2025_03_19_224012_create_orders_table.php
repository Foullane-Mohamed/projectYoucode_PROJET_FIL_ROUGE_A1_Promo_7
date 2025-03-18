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
        Schema::create('orders', function (Blueprint $table) {
          $table->id();
          $table->unsignedBigInteger('user_id');
          $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
          $table->decimal('total', 10, 2);
          $table->decimal('discount', 10, 2)->default(0);
          $table->enum('status', ['pending', 'processing', 'completed', 'cancelled'])->default('pending');
          $table->string('payment_method')->nullable();
          $table->string('payment_status')->default('pending');
          $table->text('shipping_address')->nullable();
          $table->string('shipping_method')->nullable();
          $table->unsignedBigInteger('coupon_id')->nullable();
          $table->foreign('coupon_id')->references('id')->on('coupons')->onDelete('set null');
          $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

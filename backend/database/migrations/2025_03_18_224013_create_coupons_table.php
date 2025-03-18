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
        Schema::create('coupons', function (Blueprint $table) {
          $table->id();
          $table->string('code')->unique();
          $table->enum('type', ['percentage', 'fixed']);
          $table->decimal('value', 10, 2);
          $table->unsignedBigInteger('category_id')->nullable();
          $table->foreign('category_id')->references('id')->on('categories')->onDelete('set null');
          $table->unsignedBigInteger('product_id')->nullable();
          $table->foreign('product_id')->references('id')->on('products')->onDelete('set null');
          $table->date('valid_from');
          $table->date('valid_to');
          $table->boolean('active')->default(true);
          $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('coupons');
    }
};

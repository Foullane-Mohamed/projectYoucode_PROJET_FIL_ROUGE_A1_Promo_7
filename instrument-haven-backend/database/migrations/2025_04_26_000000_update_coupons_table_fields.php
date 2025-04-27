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
        // This migration ensures that the coupons table has all the necessary fields
        // with the correct names that match what the frontend is now sending

        if (Schema::hasTable('coupons')) {
            Schema::table('coupons', function (Blueprint $table) {
                // Ensure discount_type exists and is of the correct type
                if (!Schema::hasColumn('coupons', 'discount_type')) {
                    $table->enum('discount_type', ['percentage', 'fixed'])->default('percentage')->after('code');
                }

                // Ensure discount_value exists and is of the correct type
                if (!Schema::hasColumn('coupons', 'discount_value')) {
                    $table->decimal('discount_value', 10, 2)->default(0)->after('discount_type');
                }

                // Ensure min_order_amount exists and is of the correct type
                if (!Schema::hasColumn('coupons', 'min_order_amount')) {
                    $table->decimal('min_order_amount', 10, 2)->nullable()->after('discount_value');
                }

                // Ensure max_discount_amount exists and is of the correct type
                if (!Schema::hasColumn('coupons', 'max_discount_amount')) {
                    $table->decimal('max_discount_amount', 10, 2)->nullable()->after('min_order_amount');
                }

                // Ensure usage_limit exists and is of the correct type
                if (!Schema::hasColumn('coupons', 'usage_limit')) {
                    $table->integer('usage_limit')->nullable()->after('is_active');
                }

                // Ensure usage_count exists and is of the correct type
                if (!Schema::hasColumn('coupons', 'usage_count')) {
                    $table->integer('usage_count')->default(0)->after('usage_limit');
                }

                // Ensure starts_at exists and is of the correct type
                if (!Schema::hasColumn('coupons', 'starts_at')) {
                    $table->timestamp('starts_at')->nullable()->after('max_discount_amount');
                }

                // Ensure expires_at exists and is of the correct type
                if (!Schema::hasColumn('coupons', 'expires_at')) {
                    $table->timestamp('expires_at')->nullable()->after('starts_at');
                }

                // Ensure is_active exists and is of the correct type
                if (!Schema::hasColumn('coupons', 'is_active')) {
                    $table->boolean('is_active')->default(true)->after('expires_at');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse these changes as they are just ensuring the correct structure
    }
};

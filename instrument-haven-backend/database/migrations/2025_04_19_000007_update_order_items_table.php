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
        Schema::table('order_items', function (Blueprint $table) {
            $table->string('product_name')->after('product_id');
            $table->renameColumn('price', 'unit_price');
            $table->decimal('subtotal', 10, 2)->after('unit_price');
            $table->string('thumbnail')->nullable()->after('subtotal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn(['product_name', 'subtotal', 'thumbnail']);
            $table->renameColumn('unit_price', 'price');
        });
    }
};

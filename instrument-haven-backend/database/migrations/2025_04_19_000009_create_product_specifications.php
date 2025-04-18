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
        Schema::table('products', function (Blueprint $table) {
            $table->json('specifications')->nullable()->after('images');
            $table->string('thumbnail')->nullable()->after('images');
            $table->string('slug')->unique()->after('name');
            $table->json('attributes')->nullable()->after('specifications');
            $table->boolean('is_active')->default(true)->after('stock');
            $table->boolean('on_sale')->default(false)->after('is_active');
            $table->decimal('sale_price', 10, 2)->nullable()->after('on_sale');
            $table->string('brand')->nullable()->after('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'specifications', 
                'thumbnail', 
                'slug', 
                'attributes',
                'is_active',
                'on_sale',
                'sale_price',
                'brand'
            ]);
        });
    }
};

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
        // Drop the product_tag pivot table if it exists
        if (Schema::hasTable('product_tag')) {
            Schema::dropIfExists('product_tag');
        }

        // Drop the tags table if it exists
        if (Schema::hasTable('tags')) {
            Schema::dropIfExists('tags');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Since we're using migrate:fresh, we don't need to recreate these tables
        // The original migrations will handle that if needed
    }
};

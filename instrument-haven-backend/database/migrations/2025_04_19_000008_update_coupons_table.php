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
        Schema::table('coupons', function (Blueprint $table) {
            $table->decimal('min_purchase', 10, 2)->default(0)->after('type');
            $table->renameColumn('starts_at', 'start_date');
            $table->renameColumn('expires_at', 'end_date');
            $table->integer('usage_limit')->default(0)->after('end_date');
            $table->integer('usage_count')->default(0)->after('usage_limit');
            $table->string('description')->nullable()->after('usage_count');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropColumn(['min_purchase', 'usage_limit', 'usage_count', 'description']);
            $table->renameColumn('start_date', 'starts_at');
            $table->renameColumn('end_date', 'expires_at');
        });
    }
};

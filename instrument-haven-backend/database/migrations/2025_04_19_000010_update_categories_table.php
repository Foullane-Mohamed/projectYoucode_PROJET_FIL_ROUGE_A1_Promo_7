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
        Schema::table('categories', function (Blueprint $table) {
            $table->string('image')->nullable()->after('description');
            $table->string('slug')->unique()->after('name');
            $table->string('meta_title')->nullable()->after('slug');
            $table->string('meta_description')->nullable()->after('meta_title');
            $table->integer('position')->default(0)->after('meta_description');
            $table->boolean('is_active')->default(true)->after('position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropColumn(['image', 'slug', 'meta_title', 'meta_description', 'position', 'is_active']);
        });
    }
};

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
        // No need to do anything in 'up' method
        // The original migrations now create the correct schema without subcategories and tags
    }

    /**
     * Reverse the migrations.
     * We don't need to do anything here, as this is just a marker migration
     */
    public function down(): void
    {
        // No need to do anything in 'down' method
    }
};

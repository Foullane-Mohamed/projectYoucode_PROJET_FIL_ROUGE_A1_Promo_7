<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            SubCategorySeeder::class,
            ProductSeeder::class,
            PaymentMethodSeeder::class,
            CouponSeeder::class,
            CommentSeeder::class,
            CartSeeder::class,
            OrderSeeder::class,
            ContactSeeder::class,
        ]);
    }
}
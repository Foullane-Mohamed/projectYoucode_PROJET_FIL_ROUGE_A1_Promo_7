<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@instrumenthaven.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create customer user
        $customerUser = User::create([
            'name' => 'Customer User',
            'email' => 'customer@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'email_verified_at' => now(),
        ]);

        // Assign roles
        $adminRole = Role::where('name', 'admin')->first();
        $customerRole = Role::where('name', 'customer')->first();

        if ($adminRole) {
            $adminUser->roles()->attach($adminRole->id);
        }

        if ($customerRole) {
            $customerUser->roles()->attach($customerRole->id);
        }

        // Create some demo users
        User::factory()->count(10)->create()->each(function ($user) use ($customerRole) {
            if ($customerRole) {
                $user->roles()->attach($customerRole->id);
            }
        });
    }
}

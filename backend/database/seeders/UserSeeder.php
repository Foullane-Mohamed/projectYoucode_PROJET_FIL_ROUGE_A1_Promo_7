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
        // Get role IDs
        $adminRole = Role::where('name', 'Admin')->first()->id;
        $customerRole = Role::where('name', 'Customer')->first()->id;
        $visitorRole = Role::where('name', 'Visitor')->first()->id;

        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@instrumenthaven.com',
            'password' => Hash::make('password123'),
            'phone' => '+1234567890',
            'address' => '123 Admin Street, Admin City, AC 12345',
            'role_id' => $adminRole,
        ]);

        // Create some customer users
        $customers = [
            [
                'name' => 'John Doe',
                'email' => 'john@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+1555111222',
                'address' => '101 Customer Blvd, Music City, MC 10101',
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+1555333444',
                'address' => '202 Melody Lane, Harmony Heights, HH 20202',
            ],
            [
                'name' => 'Michael Johnson',
                'email' => 'michael@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+1555555666',
                'address' => '303 Rhythm Road, Beat Borough, BB 30303',
            ],
            [
                'name' => 'Sarah Williams',
                'email' => 'sarah@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+1555777888',
                'address' => '404 Tempo Trail, Chord County, CC 40404',
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@example.com',
                'password' => Hash::make('password123'),
                'phone' => '+1555999000',
                'address' => '505 Scale Street, Note Neighborhood, NN 50505',
            ]
        ];

        foreach ($customers as $customer) {
            $customer['role_id'] = $customerRole;
            User::create($customer);
        }

        // Create additional random users
        User::factory()->count(15)->create([
            'role_id' => $customerRole
        ]);
    }
}
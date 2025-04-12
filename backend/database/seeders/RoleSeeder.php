<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create basic roles
        $roles = [
            [
                'name' => 'Admin',
                'description' => 'Administrator with full access to all features'
            ],
            [
                'name' => 'Customer',
                'description' => 'Regular customer with shopping privileges'
            ],
            [
                'name' => 'Visitor',
                'description' => 'Unauthenticated user with limited access'
            ]
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
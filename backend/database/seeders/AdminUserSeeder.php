<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Role::where('name', 'Admin')->first();
        
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@instrumenthaven.com',
            'password' => Hash::make('password123'),
            'role_id' => $adminRole->id,
        ]);
    }
}
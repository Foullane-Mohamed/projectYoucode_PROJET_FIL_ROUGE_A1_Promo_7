<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
  
    public function run(): void
    {
    
        User::create([
            'name' => 'foullane mohamed',
            'email' => 'foullane@gmail.com',
            'password' => Hash::make('foullane1996@'),
            'role' => 'admin',
            'is_active' => true,
        ]);


        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'phone' => '123-456-7890',
            'address' => '123 Main St',
            'city' => 'New York',
            'state' => 'NY',
            'zip_code' => '10001',
            'country' => 'USA',
            'is_active' => true,
        ]);

    
        User::factory(10)->create();
    }
}

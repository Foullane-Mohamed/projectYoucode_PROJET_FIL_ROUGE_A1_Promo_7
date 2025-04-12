<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'String Instruments',
                'description' => 'Instruments that produce sound through vibrating strings',
                'image' => 'string-instruments.jpg'
            ],
            [
                'name' => 'Wind Instruments',
                'description' => 'Instruments that produce sound by causing a body of air to vibrate',
                'image' => 'wind-instruments.jpg'
            ],
            [
                'name' => 'Percussion Instruments',
                'description' => 'Instruments that produce sound by being struck, shaken, or scraped',
                'image' => 'percussion-instruments.jpg'
            ],
            [
                'name' => 'Keyboard Instruments',
                'description' => 'Instruments that are played using a keyboard',
                'image' => 'keyboard-instruments.jpg'
            ],
            [
                'name' => 'Electronic Instruments',
                'description' => 'Modern instruments that produce sound electronically',
                'image' => 'electronic-instruments.jpg'
            ],
            [
                'name' => 'Accessories',
                'description' => 'Essential accessories for musicians',
                'image' => 'accessories.jpg'
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
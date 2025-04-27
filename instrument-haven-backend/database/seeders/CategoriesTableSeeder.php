<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Main categories
        $guitars = Category::create([
            'name' => 'Guitars',
            'slug' => 'guitars',
            'description' => 'All types of guitars',
            'image' => 'https://example.com/images/guitars.jpg',
        ]);

        $drums = Category::create([
            'name' => 'Drums',
            'slug' => 'drums',
            'description' => 'Acoustic and electronic drums',
            'image' => 'https://example.com/images/drums.jpg',
        ]);

        $keyboards = Category::create([
            'name' => 'Keyboards',
            'slug' => 'keyboards',
            'description' => 'Electronic keyboards and pianos',
            'image' => 'https://example.com/images/keyboards.jpg',
        ]);

        $windInstruments = Category::create([
            'name' => 'Wind Instruments',
            'slug' => 'wind-instruments',
            'description' => 'All types of wind instruments',
            'image' => 'https://example.com/images/wind-instruments.jpg',
        ]);

        $accessories = Category::create([
            'name' => 'Accessories',
            'slug' => 'accessories',
            'description' => 'Accessories for all instruments',
            'image' => 'https://example.com/images/accessories.jpg',
        ]);

        // Additional categories (no more subcategories)
        Category::create([
            'name' => 'Electric Guitars',
            'slug' => 'electric-guitars',
            'description' => 'Electric guitars for all styles',
            'image' => 'https://example.com/images/electric-guitars.jpg',
        ]);

        Category::create([
            'name' => 'Acoustic Guitars',
            'slug' => 'acoustic-guitars',
            'description' => 'Classical and acoustic guitars',
            'image' => 'https://example.com/images/acoustic-guitars.jpg',
        ]);

        Category::create([
            'name' => 'Bass Guitars',
            'slug' => 'bass-guitars',
            'description' => 'Electric and acoustic bass guitars',
            'image' => 'https://example.com/images/bass-guitars.jpg',
        ]);

        Category::create([
            'name' => 'Acoustic Drums',
            'slug' => 'acoustic-drums',
            'description' => 'Traditional acoustic drum sets',
            'image' => 'https://example.com/images/acoustic-drums.jpg',
        ]);

        Category::create([
            'name' => 'Electronic Drums',
            'slug' => 'electronic-drums',
            'description' => 'Digital and electronic drum kits',
            'image' => 'https://example.com/images/electronic-drums.jpg',
        ]);

        Category::create([
            'name' => 'Digital Pianos',
            'slug' => 'digital-pianos',
            'description' => 'Digital pianos with weighted keys',
            'image' => 'https://example.com/images/digital-pianos.jpg',
        ]);

        Category::create([
            'name' => 'Synthesizers',
            'slug' => 'synthesizers',
            'description' => 'Analog and digital synthesizers',
            'image' => 'https://example.com/images/synthesizers.jpg',
        ]);

        Category::create([
            'name' => 'Saxophones',
            'slug' => 'saxophones',
            'description' => 'All types of saxophones',
            'image' => 'https://example.com/images/saxophones.jpg',
        ]);

        Category::create([
            'name' => 'Flutes',
            'slug' => 'flutes',
            'description' => 'Concert and folk flutes',
            'image' => 'https://example.com/images/flutes.jpg',
        ]);

        Category::create([
            'name' => 'Guitar Accessories',
            'slug' => 'guitar-accessories',
            'description' => 'Picks, strings, capos, and more',
            'image' => 'https://example.com/images/guitar-accessories.jpg',
        ]);

        Category::create([
            'name' => 'Drum Accessories',
            'slug' => 'drum-accessories',
            'description' => 'Drumsticks, heads, cymbals, and more',
            'image' => 'https://example.com/images/drum-accessories.jpg',
        ]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get category IDs
        $electricGuitarCategory = Category::where('slug', 'electric-guitars')->first();
        $acousticGuitarCategory = Category::where('slug', 'acoustic-guitars')->first();
        $classicalGuitarCategory = Category::where('slug', 'classical-guitars')->first();
        $violinCategory = Category::where('slug', 'violins')->first();
        $celloCategory = Category::where('slug', 'cellos')->first();
        $fluteCategory = Category::where('slug', 'flutes')->first();
        $clarinetCategory = Category::where('slug', 'clarinets')->first();
        $percussionCategory = Category::where('slug', 'percussion')->first();

        // Electric Guitars
        $products = [
            [
                'name' => 'Fender Stratocaster',
                'slug' => 'fender-stratocaster',
                'description' => 'Classic electric guitar with legendary tone',
                'price' => 899.99,
                'stock' => 10,
                'category_id' => $electricGuitarCategory->id,
                'brand' => 'Fender',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Fender',
                    'color' => 'Sunburst',
                    'material' => 'Alder body, Maple neck',
                    'weight' => '3.6kg'
                ],
                'attributes' => [
                    'color' => 'Sunburst',
                    'material' => 'Alder',
                    'string_count' => '6'
                ]
            ],
            [
                'name' => 'Gibson Les Paul',
                'slug' => 'gibson-les-paul',
                'description' => 'Iconic electric guitar with rich, warm tone',
                'price' => 1299.99,
                'stock' => 5,
                'category_id' => $electricGuitarCategory->id,
                'brand' => 'Gibson',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Gibson',
                    'color' => 'Cherry Sunburst',
                    'material' => 'Mahogany body, Maple top',
                    'weight' => '4.2kg'
                ],
                'attributes' => [
                    'color' => 'Cherry Sunburst',
                    'material' => 'Mahogany',
                    'string_count' => '6'
                ]
            ],
            // Acoustic Guitars
            [
                'name' => 'Martin D-28',
                'slug' => 'martin-d28',
                'description' => 'Premium acoustic guitar with exceptional sound',
                'price' => 2999.99,
                'stock' => 3,
                'category_id' => $acousticGuitarCategory->id,
                'brand' => 'Martin',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Martin',
                    'color' => 'Natural',
                    'material' => 'Sitka spruce top, East Indian rosewood back and sides',
                    'weight' => '2.8kg'
                ],
                'attributes' => [
                    'color' => 'Natural',
                    'material' => 'Spruce/Rosewood',
                    'string_count' => '6'
                ]
            ],
            [
                'name' => 'Taylor 314ce',
                'slug' => 'taylor-314ce',
                'description' => 'Versatile acoustic-electric guitar with balanced tone',
                'price' => 1999.99,
                'stock' => 7,
                'category_id' => $acousticGuitarCategory->id,
                'brand' => 'Taylor',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Taylor',
                    'color' => 'Natural',
                    'material' => 'Sitka spruce top, Sapele back and sides',
                    'weight' => '2.5kg'
                ],
                'attributes' => [
                    'color' => 'Natural',
                    'material' => 'Spruce/Sapele',
                    'string_count' => '6'
                ]
            ],
            // Classical Guitars
            [
                'name' => 'Cordoba C5',
                'slug' => 'cordoba-c5',
                'description' => 'Handcrafted classical guitar with warm tone',
                'price' => 499.99,
                'stock' => 12,
                'category_id' => $classicalGuitarCategory->id,
                'brand' => 'Cordoba',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Cordoba',
                    'color' => 'Natural',
                    'material' => 'Cedar top, Mahogany back and sides',
                    'weight' => '2.2kg'
                ],
                'attributes' => [
                    'color' => 'Natural',
                    'material' => 'Cedar/Mahogany',
                    'string_count' => '6'
                ]
            ],
            // Violins
            [
                'name' => 'Stradivarius Model Violin',
                'slug' => 'stradivarius-model-violin',
                'description' => 'Professional violin with exquisite craftsmanship',
                'price' => 1599.99,
                'stock' => 4,
                'category_id' => $violinCategory->id,
                'brand' => 'Stradivarius',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Stradivarius',
                    'color' => 'Antique Varnish',
                    'material' => 'Spruce top, Maple back and sides',
                    'weight' => '0.45kg'
                ],
                'attributes' => [
                    'color' => 'Antique Varnish',
                    'material' => 'Spruce/Maple',
                    'string_count' => '4'
                ]
            ],
            // Cellos
            [
                'name' => 'Yamaha AVC5 Cello',
                'slug' => 'yamaha-avc5-cello',
                'description' => 'Quality cello for intermediate players',
                'price' => 1299.99,
                'stock' => 6,
                'category_id' => $celloCategory->id,
                'brand' => 'Yamaha',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Yamaha',
                    'color' => 'Brown',
                    'material' => 'Spruce top, Maple back and sides',
                    'weight' => '3.2kg'
                ],
                'attributes' => [
                    'color' => 'Brown',
                    'material' => 'Spruce/Maple',
                    'string_count' => '4'
                ]
            ],
            // Flutes
            [
                'name' => 'Yamaha YFL-222 Flute',
                'slug' => 'yamaha-yfl-222-flute',
                'description' => 'Student flute with excellent intonation',
                'price' => 699.99,
                'stock' => 15,
                'category_id' => $fluteCategory->id,
                'brand' => 'Yamaha',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Yamaha',
                    'color' => 'Silver',
                    'material' => 'Nickel silver',
                    'weight' => '0.42kg'
                ],
                'attributes' => [
                    'color' => 'Silver',
                    'material' => 'Nickel Silver',
                ]
            ],
            // Clarinets
            [
                'name' => 'Buffet E13 Clarinet',
                'slug' => 'buffet-e13-clarinet',
                'description' => 'Professional clarinet with rich tone',
                'price' => 2299.99,
                'stock' => 8,
                'category_id' => $clarinetCategory->id,
                'brand' => 'Buffet',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Buffet',
                    'color' => 'Black',
                    'material' => 'Grenadilla wood',
                    'weight' => '0.82kg'
                ],
                'attributes' => [
                    'color' => 'Black',
                    'material' => 'Grenadilla',
                ]
            ],
            // Percussion
            [
                'name' => 'Pearl Export Drum Kit',
                'slug' => 'pearl-export-drum-kit',
                'description' => 'Complete drum kit for beginners and intermediates',
                'price' => 799.99,
                'stock' => 5,
                'category_id' => $percussionCategory->id,
                'brand' => 'Pearl',
                'is_active' => true,
                'specifications' => [
                    'brand' => 'Pearl',
                    'color' => 'Jet Black',
                    'material' => 'Poplar/Asian Mahogany shells',
                    'weight' => '25kg'
                ],
                'attributes' => [
                    'color' => 'Jet Black',
                    'material' => 'Poplar/Mahogany',
                ]
            ],
        ];

        foreach ($products as $productData) {
            Product::create($productData);
        }
    }
}

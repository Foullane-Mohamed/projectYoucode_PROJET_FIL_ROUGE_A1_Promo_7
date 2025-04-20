<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get categories
        $electricGuitars = Category::where('slug', 'electric-guitars')->first();
        $acousticGuitars = Category::where('slug', 'acoustic-guitars')->first();
        $bassGuitars = Category::where('slug', 'bass-guitars')->first();
        $acousticDrums = Category::where('slug', 'acoustic-drums')->first();
        $electronicDrums = Category::where('slug', 'electronic-drums')->first();
        $digitalPianos = Category::where('slug', 'digital-pianos')->first();
        $synthesizers = Category::where('slug', 'synthesizers')->first();
        $saxophones = Category::where('slug', 'saxophones')->first();
        $flutes = Category::where('slug', 'flutes')->first();
        
        // Create electric guitar products
        Product::create([
            'name' => 'Fender Stratocaster',
            'slug' => 'fender-stratocaster',
            'description' => 'The Fender Stratocaster is a model of electric guitar designed from 1952 into 1954 by Leo Fender, Bill Carson, George Fullerton and Freddie Tavares. The Fender Musical Instruments Corporation has continuously manufactured the Stratocaster from 1954 to the present. It is a double-cutaway guitar, with an extended top "horn" shape for balance.',
            'price' => 799.99,
            'stock' => 15,
            'thumbnail' => 'https://example.com/images/fender-stratocaster.jpg',
            'images' => ['https://example.com/images/fender-stratocaster.jpg', 'https://example.com/images/fender-stratocaster-2.jpg'],
            'category_id' => $electricGuitars->id,
            'brand' => 'Fender',
            'specifications' => [
                'color' => 'Sunburst',
                'material' => 'Alder',
                'weight' => '3.8kg'
            ],
            'attributes' => [
                'pickup_type' => 'Single Coil',
                'fret_count' => 22
            ],
            'is_active' => true,
            'on_sale' => false,
        ]);

        Product::create([
            'name' => 'Gibson Les Paul',
            'slug' => 'gibson-les-paul',
            'description' => 'The Gibson Les Paul is a solid body electric guitar that was first sold by the Gibson Guitar Corporation in 1952. The Les Paul was designed by Gibson president Ted McCarty, factory manager John Huis and their team, with input from and endorsement by guitarist Les Paul.',
            'price' => 1299.99,
            'sale_price' => 1099.99,
            'stock' => 10,
            'thumbnail' => 'https://example.com/images/gibson-les-paul.jpg',
            'images' => ['https://example.com/images/gibson-les-paul.jpg', 'https://example.com/images/gibson-les-paul-2.jpg'],
            'category_id' => $electricGuitars->id,
            'brand' => 'Gibson',
            'specifications' => [
                'color' => 'Cherry Sunburst',
                'material' => 'Mahogany',
                'weight' => '4.2kg'
            ],
            'attributes' => [
                'pickup_type' => 'Humbucker',
                'fret_count' => 22
            ],
            'is_active' => true,
            'on_sale' => true,
        ]);

        // Create acoustic guitar products
        Product::create([
            'name' => 'Martin D-28',
            'slug' => 'martin-d-28',
            'description' => 'The Martin D-28 is a dreadnought acoustic guitar model built by C.F. Martin & Company. It first appeared in 1931 as a variation of the D-1, using rosewood for its back and sides and a spruce top. The D-28 is considered the iconic acoustic guitar, and its uses span many music genres.',
            'price' => 2999.99,
            'stock' => 5,
            'thumbnail' => 'https://example.com/images/martin-d28.jpg',
            'images' => ['https://example.com/images/martin-d28.jpg', 'https://example.com/images/martin-d28-2.jpg'],
            'category_id' => $acousticGuitars->id,
            'brand' => 'Martin',
            'specifications' => [
                'color' => 'Natural',
                'material' => 'Rosewood and Spruce',
                'weight' => '2.8kg'
            ],
            'attributes' => [
                'type' => 'Dreadnought',
                'string_count' => 6
            ],
            'is_active' => true,
            'on_sale' => false,
        ]);

        // Create bass guitar products
        Product::create([
            'name' => 'Fender Precision Bass',
            'slug' => 'fender-precision-bass',
            'description' => 'The Fender Precision Bass (often shortened to "P-Bass") is a bass guitar manufactured by Fender Musical Instruments Corporation. The Precision Bass was the first electric bass to earn widespread popularity and is the basis for the design of most electric basses that followed.',
            'price' => 899.99,
            'stock' => 12,
            'thumbnail' => 'https://example.com/images/fender-pbass.jpg',
            'images' => ['https://example.com/images/fender-pbass.jpg', 'https://example.com/images/fender-pbass-2.jpg'],
            'category_id' => $bassGuitars->id,
            'brand' => 'Fender',
            'specifications' => [
                'color' => 'Black',
                'material' => 'Alder',
                'weight' => '4.1kg'
            ],
            'attributes' => [
                'pickup_type' => 'Split Coil',
                'string_count' => 4
            ],
            'is_active' => true,
            'on_sale' => false,
        ]);

        // Create acoustic drum products
        Product::create([
            'name' => 'Pearl Export',
            'slug' => 'pearl-export',
            'description' => 'The Pearl Export is a drum kit manufactured by Pearl Drums. It is one of the best-selling drum kits of all time and has been a popular choice for beginners and intermediate drummers since its introduction in the 1980s.',
            'price' => 699.99,
            'stock' => 8,
            'thumbnail' => 'https://example.com/images/pearl-export.jpg',
            'images' => ['https://example.com/images/pearl-export.jpg', 'https://example.com/images/pearl-export-2.jpg'],
            'category_id' => $acousticDrums->id,
            'brand' => 'Pearl',
            'specifications' => [
                'color' => 'Jet Black',
                'material' => 'Poplar',
                'pieces' => '5'
            ],
            'attributes' => [
                'bass_drum_size' => '22"',
                'snare_size' => '14"'
            ],
            'is_active' => true,
            'on_sale' => false,
        ]);

        // Create electronic drum products
        Product::create([
            'name' => 'Roland TD-17KVX',
            'slug' => 'roland-td-17kvx',
            'description' => 'The Roland TD-17KVX is an electronic drum kit that provides a natural, comfortable drumming experience with flagship-derived technology. It features responsive mesh-head pads and a sound module with expressive sound and training functions.',
            'price' => 1699.99,
            'sale_price' => 1499.99,
            'stock' => 6,
            'thumbnail' => 'https://example.com/images/roland-td17kvx.jpg',
            'images' => ['https://example.com/images/roland-td17kvx.jpg', 'https://example.com/images/roland-td17kvx-2.jpg'],
            'category_id' => $electronicDrums->id,
            'brand' => 'Roland',
            'specifications' => [
                'color' => 'Black',
                'material' => 'Mixed',
                'pieces' => '5'
            ],
            'attributes' => [
                'pads' => 'Mesh-head',
                'sounds' => '310'
            ],
            'is_active' => true,
            'on_sale' => true,
        ]);

        // Create digital piano products
        Product::create([
            'name' => 'Yamaha P-125',
            'slug' => 'yamaha-p125',
            'description' => 'The Yamaha P-125 is a compact digital piano that combines incredible piano performance with a user-friendly minimalistic design. Easily portable and extremely accessible, this instrument allows you to experience the joy of playing the piano on your terms.',
            'price' => 649.99,
            'stock' => 15,
            'thumbnail' => 'https://example.com/images/yamaha-p125.jpg',
            'images' => ['https://example.com/images/yamaha-p125.jpg', 'https://example.com/images/yamaha-p125-2.jpg'],
            'category_id' => $digitalPianos->id,
            'brand' => 'Yamaha',
            'specifications' => [
                'color' => 'Black',
                'material' => 'Plastic',
                'weight' => '11.8kg'
            ],
            'attributes' => [
                'keys' => '88',
                'touch_sensitivity' => 'Weighted'
            ],
            'is_active' => true,
            'on_sale' => false,
        ]);

        // Create synthesizer products
        Product::create([
            'name' => 'Korg Minilogue',
            'slug' => 'korg-minilogue',
            'description' => 'The Korg Minilogue is a polyphonic analog synthesizer featuring a four-voice architecture and flexible sound shaping capabilities. With its sleek design and intuitive interface, it\'s perfect for both studio production and live performance.',
            'price' => 499.99,
            'stock' => 10,
            'thumbnail' => 'https://example.com/images/korg-minilogue.jpg',
            'images' => ['https://example.com/images/korg-minilogue.jpg', 'https://example.com/images/korg-minilogue-2.jpg'],
            'category_id' => $synthesizers->id,
            'brand' => 'Korg',
            'specifications' => [
                'color' => 'Silver',
                'material' => 'Metal',
                'weight' => '2.8kg'
            ],
            'attributes' => [
                'keys' => '37',
                'voices' => '4'
            ],
            'is_active' => true,
            'on_sale' => false,
        ]);

        // Create saxophone products
        Product::create([
            'name' => 'Yamaha YAS-280',
            'slug' => 'yamaha-yas-280',
            'description' => 'The Yamaha YAS-280 is an alto saxophone designed for students and beginners. It offers excellent intonation, smooth playability, and a warm, rich tone that makes it ideal for developing musicians.',
            'price' => 1249.99,
            'stock' => 7,
            'thumbnail' => 'https://example.com/images/yamaha-yas280.jpg',
            'images' => ['https://example.com/images/yamaha-yas280.jpg', 'https://example.com/images/yamaha-yas280-2.jpg'],
            'category_id' => $saxophones->id,
            'brand' => 'Yamaha',
            'specifications' => [
                'color' => 'Gold',
                'material' => 'Brass',
                'weight' => '2.5kg'
            ],
            'attributes' => [
                'type' => 'Alto',
                'key' => 'Eb'
            ],
            'is_active' => true,
            'on_sale' => false,
        ]);

        // Create flute products
        Product::create([
            'name' => 'Pearl Quantz 505E',
            'slug' => 'pearl-quantz-505e',
            'description' => 'The Pearl Quantz 505E is a flute designed for advancing players. It features a silver-plated head, body, and foot, with pointed key arms and a split E mechanism for improved high E playability.',
            'price' => 899.99,
            'stock' => 5,
            'thumbnail' => 'https://example.com/images/pearl-quantz505e.jpg',
            'images' => ['https://example.com/images/pearl-quantz505e.jpg', 'https://example.com/images/pearl-quantz505e-2.jpg'],
            'category_id' => $flutes->id,
            'brand' => 'Pearl',
            'specifications' => [
                'color' => 'Silver',
                'material' => 'Silver-plated',
                'weight' => '0.6kg'
            ],
            'attributes' => [
                'key' => 'C',
                'level' => 'Intermediate'
            ],
            'is_active' => true,
            'on_sale' => false,
        ]);
    }
}

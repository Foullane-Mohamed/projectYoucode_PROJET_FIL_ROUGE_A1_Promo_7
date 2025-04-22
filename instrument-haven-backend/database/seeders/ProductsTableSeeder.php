<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductsTableSeeder extends Seeder
{
  
    public function run(): void
    {
        $electricGuitars = Category::where('slug', 'electric-guitars')->first();
        $acousticGuitars = Category::where('slug', 'acoustic-guitars')->first();
        $bassGuitars = Category::where('slug', 'bass-guitars')->first();
        $acousticDrums = Category::where('slug', 'acoustic-drums')->first();
        $electronicDrums = Category::where('slug', 'electronic-drums')->first();
        $digitalPianos = Category::where('slug', 'digital-pianos')->first();
        $synthesizers = Category::where('slug', 'synthesizers')->first();
        $saxophones = Category::where('slug', 'saxophones')->first();
        $flutes = Category::where('slug', 'flutes')->first();
        
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
            'thumbnail' => 'https://m.media-amazon.com/images/I/71XPlMpB-LL._AC_UF350,350_QL80_.jpg',
            'images' => ['https://m.media-amazon.com/images/I/71XPlMpB-LL._AC_UF350,350_QL80_.jpg', 'https://m.media-amazon.com/images/I/71XPlMpB-LL._AC_UF350,350_QL80_.jpg'],
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
            'name' => 'piano',
            'slug' => 'fender-precision-bass',
            'description' => 'piano origin moroco',
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
            'name' => 'guitar classic',
            'slug' => 'pearl-export',
            'description' => 'spanish guitar made in spain',
            'price' => 699.99,
            'stock' => 8,
            'thumbnail' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR93J2KsKQEidzHNOtyDjyjJ9uMy5xMq4MVCA&s',
            'images' => ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR93J2KsKQEidzHNOtyDjyjJ9uMy5xMq4MVCA&s', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR93J2KsKQEidzHNOtyDjyjJ9uMy5xMq4MVCA&s'],
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
            'name' => 'panjo ',
            'slug' => 'roland-td-17kvx',
            'description' => 'panjo amazigh mood, morrocin orign',
            'price' => 1699.99,
            'sale_price' => 1499.99,
            'stock' => 6,
            'thumbnail' => 'https://i.redd.it/6hgku329vqa81.jpg',
            'images' => ['https://i.redd.it/6hgku329vqa81.jpg', 'https://i.redd.it/6hgku329vqa81.jpg'],
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



    }
}

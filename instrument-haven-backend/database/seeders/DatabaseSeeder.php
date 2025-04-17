<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create regular user
        User::create([
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'role' => 'customer',
        ]);

        // Create categories
        $stringCategory = Category::create([
            'name' => 'String Instruments',
            'description' => 'Instruments that produce sound through vibrating strings',
        ]);

        $windCategory = Category::create([
            'name' => 'Wind Instruments',
            'description' => 'Instruments that produce sound through vibrating air',
        ]);

        $percussionCategory = Category::create([
            'name' => 'Percussion Instruments',
            'description' => 'Instruments that produce sound through striking or shaking',
        ]);

        // Create subcategories
        $guitarCategory = Category::create([
            'name' => 'Guitars',
            'description' => 'String instruments with a neck and a sound box',
            'parent_id' => $stringCategory->id,
        ]);

        $violinCategory = Category::create([
            'name' => 'Violins',
            'description' => 'String instruments played with a bow',
            'parent_id' => $stringCategory->id,
        ]);

        $fluteCategory = Category::create([
            'name' => 'Flutes',
            'description' => 'Wind instruments without reeds',
            'parent_id' => $windCategory->id,
        ]);

        $drumsCategory = Category::create([
            'name' => 'Drums',
            'description' => 'Percussion instruments with a membrane',
            'parent_id' => $percussionCategory->id,
        ]);

        // Create tags
        $beginnerTag = Tag::create(['name' => 'Beginner']);
        $intermediateTag = Tag::create(['name' => 'Intermediate']);
        $advancedTag = Tag::create(['name' => 'Advanced']);
        $acousticTag = Tag::create(['name' => 'Acoustic']);
        $electricTag = Tag::create(['name' => 'Electric']);

        // Create products
        $acousticGuitar = Product::create([
            'name' => 'Acoustic Guitar',
            'description' => 'A beautiful acoustic guitar perfect for beginners and experienced players alike.',
            'price' => 299.99,
            'stock' => 50,
            'category_id' => $guitarCategory->id,
            'images' => ['products/acoustic-guitar.jpg'],
        ]);
        $acousticGuitar->tags()->attach([$beginnerTag->id, $acousticTag->id]);

        $electricGuitar = Product::create([
            'name' => 'Electric Guitar',
            'description' => 'A high-quality electric guitar with amazing sound and playability.',
            'price' => 499.99,
            'stock' => 30,
            'category_id' => $guitarCategory->id,
            'images' => ['products/electric-guitar.jpg'],
        ]);
        $electricGuitar->tags()->attach([$intermediateTag->id, $electricTag->id]);

        $violin = Product::create([
            'name' => 'Professional Violin',
            'description' => 'A handcrafted violin with exceptional tone and projection.',
            'price' => 899.99,
            'stock' => 15,
            'category_id' => $violinCategory->id,
            'images' => ['products/violin.jpg'],
        ]);
        $violin->tags()->attach([$advancedTag->id, $acousticTag->id]);

        $flute = Product::create([
            'name' => 'Silver Flute',
            'description' => 'A sterling silver flute with excellent intonation and response.',
            'price' => 749.99,
            'stock' => 20,
            'category_id' => $fluteCategory->id,
            'images' => ['products/flute.jpg'],
        ]);
        $flute->tags()->attach([$intermediateTag->id]);

        $drumSet = Product::create([
            'name' => 'Complete Drum Set',
            'description' => 'A complete drum set with everything you need to start playing.',
            'price' => 599.99,
            'stock' => 10,
            'category_id' => $drumsCategory->id,
            'images' => ['products/drum-set.jpg'],
        ]);
        $drumSet->tags()->attach([$beginnerTag->id]);

        // Create coupons
        Coupon::create([
            'code' => 'WELCOME10',
            'discount' => 10,
            'type' => 'percentage',
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'SUMMER25',
            'discount' => 25,
            'type' => 'percentage',
            'starts_at' => now(),
            'expires_at' => now()->addMonths(3),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'FLAT50',
            'discount' => 50,
            'type' => 'fixed',
            'is_active' => true,
        ]);
    }
}
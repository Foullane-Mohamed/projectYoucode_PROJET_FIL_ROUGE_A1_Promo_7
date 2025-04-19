<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create parent categories
        $stringCategory = Category::create([
            'name' => 'String Instruments',
            'slug' => 'string-instruments',
            'description' => 'Guitars, violins, and other string instruments',
            'image' => null,
            'is_active' => true,
            'position' => 1,
        ]);

        $windCategory = Category::create([
            'name' => 'Wind Instruments',
            'slug' => 'wind-instruments',
            'description' => 'Flutes, clarinets, and other wind instruments',
            'image' => null,
            'is_active' => true,
            'position' => 2,
        ]);

        $percussionCategory = Category::create([
            'name' => 'Percussion',
            'slug' => 'percussion',
            'description' => 'Drums, cymbals, and percussion instruments',
            'image' => null,
            'is_active' => true,
            'position' => 3,
        ]);

        // Create subcategories for String Instruments
        $guitarCategory = Category::create([
            'name' => 'Guitars',
            'slug' => 'guitars',
            'description' => 'Acoustic and electric guitars',
            'parent_id' => $stringCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 1,
        ]);

        $violinCategory = Category::create([
            'name' => 'Violins',
            'slug' => 'violins',
            'description' => 'Classical and modern violins',
            'parent_id' => $stringCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 2,
        ]);

        $celloCategory = Category::create([
            'name' => 'Cellos',
            'slug' => 'cellos',
            'description' => 'Professional and student cellos',
            'parent_id' => $stringCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 3,
        ]);

        // Create subcategories for Guitars
        Category::create([
            'name' => 'Electric Guitars',
            'slug' => 'electric-guitars',
            'description' => 'Modern electric guitars for all styles',
            'parent_id' => $guitarCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 1,
        ]);

        Category::create([
            'name' => 'Acoustic Guitars',
            'slug' => 'acoustic-guitars',
            'description' => 'Traditional and modern acoustic guitars',
            'parent_id' => $guitarCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 2,
        ]);

        Category::create([
            'name' => 'Classical Guitars',
            'slug' => 'classical-guitars',
            'description' => 'Nylon-string classical guitars',
            'parent_id' => $guitarCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 3,
        ]);

        // Create subcategories for Wind Instruments
        $woodwindsCategory = Category::create([
            'name' => 'Woodwinds',
            'slug' => 'woodwinds',
            'description' => 'Flutes, clarinets, and saxophones',
            'parent_id' => $windCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 1,
        ]);

        $brassCategory = Category::create([
            'name' => 'Brass',
            'slug' => 'brass',
            'description' => 'Trumpets, trombones, and tubas',
            'parent_id' => $windCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 2,
        ]);

        // Create subcategories for Woodwinds
        Category::create([
            'name' => 'Flutes',
            'slug' => 'flutes',
            'description' => 'Concert and student flutes',
            'parent_id' => $woodwindsCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 1,
        ]);

        Category::create([
            'name' => 'Clarinets',
            'slug' => 'clarinets',
            'description' => 'Professional and student clarinets',
            'parent_id' => $woodwindsCategory->id,
            'image' => null,
            'is_active' => true,
            'position' => 2,
        ]);
    }
}

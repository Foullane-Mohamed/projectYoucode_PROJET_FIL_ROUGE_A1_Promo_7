<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Tag;
use App\Models\Product;

class TagsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create tags
        $tags = [
            'Best Seller' => 'best-seller',
            'New Arrival' => 'new-arrival',
            'Featured' => 'featured',
            'Sale' => 'sale',
            'Beginner' => 'beginner',
            'Intermediate' => 'intermediate',
            'Professional' => 'professional',
            'Vintage' => 'vintage',
            'Limited Edition' => 'limited-edition',
        ];
        
        $tagModels = [];
        
        foreach ($tags as $name => $slug) {
            $tagModels[$slug] = Tag::create([
                'name' => $name,
                'slug' => $slug,
            ]);
        }
        
        // Attach tags to products
        $products = Product::all();
        
        // Fender Stratocaster
        $products->where('slug', 'fender-stratocaster')->first()->tags()->attach([
            $tagModels['best-seller']->id,
            $tagModels['intermediate']->id,
        ]);
        
        // Gibson Les Paul
        $products->where('slug', 'gibson-les-paul')->first()->tags()->attach([
            $tagModels['sale']->id,
            $tagModels['professional']->id,
        ]);
        
        // Martin D-28
        $products->where('slug', 'martin-d-28')->first()->tags()->attach([
            $tagModels['professional']->id,
            $tagModels['vintage']->id,
        ]);
        
        // Fender Precision Bass
        $products->where('slug', 'fender-precision-bass')->first()->tags()->attach([
            $tagModels['best-seller']->id,
            $tagModels['intermediate']->id,
        ]);
        
        // Pearl Export
        $products->where('slug', 'pearl-export')->first()->tags()->attach([
            $tagModels['beginner']->id,
            $tagModels['best-seller']->id,
        ]);
        
        // Roland TD-17KVX
        $products->where('slug', 'roland-td-17kvx')->first()->tags()->attach([
            $tagModels['sale']->id,
            $tagModels['intermediate']->id,
        ]);
        
        // Yamaha P-125
        $products->where('slug', 'yamaha-p125')->first()->tags()->attach([
            $tagModels['best-seller']->id,
            $tagModels['beginner']->id,
        ]);
        
        // Korg Minilogue
        $products->where('slug', 'korg-minilogue')->first()->tags()->attach([
            $tagModels['featured']->id,
            $tagModels['intermediate']->id,
        ]);
        
        // Yamaha YAS-280
        $products->where('slug', 'yamaha-yas-280')->first()->tags()->attach([
            $tagModels['beginner']->id,
        ]);
        
        // Pearl Quantz 505E
        $products->where('slug', 'pearl-quantz-505e')->first()->tags()->attach([
            $tagModels['intermediate']->id,
        ]);
    }
}

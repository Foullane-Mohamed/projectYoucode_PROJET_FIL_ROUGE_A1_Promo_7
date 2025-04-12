<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get customers
        $customers = User::whereHas('role', function ($query) {
            $query->where('name', 'Customer');
        })->get();

        if ($customers->isEmpty()) {
            return;
        }

        // Get products
        $products = Product::all();

        // Sample comments
        $commentContents = [
            "This instrument exceeded my expectations! The sound quality is incredible and the build quality is top-notch.",
            "Great value for the price. I've been playing for years and this is one of the best instruments I've owned.",
            "Solid construction and beautiful tone. My instructor was impressed with how well it plays.",
            "I'm a beginner and this was perfect for me. Easy to play and sounds great even in my inexperienced hands.",
            "Arrived in perfect condition and was exactly as described. Very happy with this purchase.",
            "Good quality but took some time to break in. After a few weeks of playing, it sounds much better.",
            "The sound is decent but not as rich as I expected for the price point.",
            "Excellent craftsmanship. You can tell this was made with care and attention to detail.",
            "Perfect for students or hobbyists. Maybe not for professional performances, but great for practice.",
            "I've owned many instruments over the years, and this ranks among the best. Would definitely recommend.",
            "The tone is rich and resonant. Exactly what I was looking for in this type of instrument.",
            "Shipping was fast and the instrument was well-packaged. No damage at all.",
            "A bit expensive, but you get what you pay for. The quality is evident from the moment you unbox it.",
            "My child loves this instrument. It's the perfect size and weight for a young musician.",
            "The sound projection is amazing. This instrument fills the room with beautiful music.",
            "I was skeptical about buying an instrument online, but this exceeded my expectations. Very pleased.",
            "Needed some adjustment after arrival, but once set up, it plays beautifully.",
            "Not quite as described in the product listing. The finish has some imperfections.",
            "Love the warm tone this produces. Perfect for the style of music I play.",
            "Sturdy build quality. Feels like it will last for many years."
        ];

        foreach ($products as $product) {
            // Add 0-5 random comments for each product
            $commentCount = rand(0, 5);
            
            for ($i = 0; $i < $commentCount; $i++) {
                // Random customer
                $customer = $customers->random();
                
                // Random rating between 3 and 5 (skewing positive)
                $rating = rand(3, 5);
                
                // Random comment
                $content = $commentContents[array_rand($commentContents)];
                
                Comment::create([
                    'user_id' => $customer->id,
                    'product_id' => $product->id,
                    'content' => $content,
                    'rating' => $rating
                ]);
            }
        }
    }
}
<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get subcategory IDs
        $guitarId = SubCategory::where('name', 'Guitars')->first()->id;
        $violinId = SubCategory::where('name', 'Violins')->first()->id;
        $drumsId = SubCategory::where('name', 'Drums')->first()->id;
        $pianoId = SubCategory::where('name', 'Pianos')->first()->id;
        $flutesId = SubCategory::where('name', 'Flutes')->first()->id;
        $djEquipId = SubCategory::where('name', 'DJ Equipment')->first()->id;
        $stringsId = SubCategory::where('name', 'Strings')->first()->id;
        $casesId = SubCategory::where('name', 'Cases')->first()->id;

        // Define products
        $products = [
            // Guitars
            [
                'name' => 'Fender Stratocaster Electric Guitar',
                'description' => 'The Fender Stratocaster is a model of electric guitar designed from 1952 into 1954 by Leo Fender, Bill Carson, George Fullerton and Freddie Tavares. The Fender Musical Instruments Corporation has continuously manufactured the Stratocaster from 1954 to the present. It is a double-cutaway guitar, with an extended top "horn" shape for balance.',
                'price' => 1499.99,
                'stock' => 10,
                'image' => 'fender-stratocaster.jpg',
                'subcategory_id' => $guitarId,
                'status' => 'active'
            ],
            [
                'name' => 'Gibson Les Paul Standard',
                'description' => 'The Gibson Les Paul Standard is a solid body electric guitar made by Gibson. The Les Paul was designed by Gibson president Ted McCarty, factory manager John Huis and their team with input from and endorsement by guitarist Les Paul. It is one of the most widely recognized electric guitar designs in the world.',
                'price' => 2599.99,
                'stock' => 5,
                'image' => 'gibson-les-paul.jpg',
                'subcategory_id' => $guitarId,
                'status' => 'active'
            ],
            [
                'name' => 'Martin D-28 Acoustic Guitar',
                'description' => 'The Martin D-28 is a dreadnought acoustic guitar model made by C. F. Martin & Company. It is a large-bodied acoustic guitar that generates deep bass tones and has been in continuous production since 1931. It is considered the iconic acoustic guitar that all others are measured against.',
                'price' => 2899.99,
                'stock' => 3,
                'image' => 'martin-d28.jpg',
                'subcategory_id' => $guitarId,
                'status' => 'active'
            ],

            // Violins
            [
                'name' => 'Stentor Student Violin Outfit',
                'description' => 'The Stentor Student Violin is designed for beginners and is available in a range of sizes from 1/16 to 4/4. The outfit includes a violin, bow and lightweight case and is the ideal starter instrument for a child or adult.',
                'price' => 199.99,
                'stock' => 15,
                'image' => 'stentor-violin.jpg',
                'subcategory_id' => $violinId,
                'status' => 'active'
            ],
            [
                'name' => 'Yamaha V3 Series Student Violin Outfit',
                'description' => 'The Yamaha V3 violin is handcrafted with a spruce top, maple back, sides, and neck. The ebony fingerboard, pegs, and chinrest provide a classic look and quality sound. This outfit includes a case, bow, and rosin.',
                'price' => 349.99,
                'stock' => 8,
                'image' => 'yamaha-violin.jpg',
                'subcategory_id' => $violinId,
                'status' => 'active'
            ],

            // Drums
            [
                'name' => 'Pearl Export 5-Piece Drum Set',
                'description' => 'The Pearl Export Series 5-piece drum set includes a 22" x 18" bass drum, 10" x 7" and 12" x 8" toms, 16" x 16" floor tom, and a 14" x 5.5" snare drum. It features Pearl\'s SST (Superior Shell Technology) for enhanced resonance and projection.',
                'price' => 799.99,
                'stock' => 4,
                'image' => 'pearl-export.jpg',
                'subcategory_id' => $drumsId,
                'status' => 'active'
            ],
            [
                'name' => 'Roland TD-17KVX Electronic Drum Set',
                'description' => 'The Roland TD-17KVX features the TD-17 sound module with Prismatic Sound Modeling derived from the flagship TD-50, providing a rich, realistic drumming experience. The set includes mesh-head pads for the snare and toms, a ride cymbal with three-way triggering, and more.',
                'price' => 1599.99,
                'stock' => 3,
                'image' => 'roland-td17kvx.jpg',
                'subcategory_id' => $drumsId,
                'status' => 'active'
            ],

            // Pianos
            [
                'name' => 'Yamaha U1 Upright Piano',
                'description' => 'The Yamaha U1 is a professional upright piano known for its rich tone and responsive touch. It features a solid spruce soundboard, hard maple bridge, and multi-layer mahogany hammer shanks for exceptional sound quality.',
                'price' => 9999.99,
                'stock' => 2,
                'image' => 'yamaha-u1.jpg',
                'subcategory_id' => $pianoId,
                'status' => 'active'
            ],
            [
                'name' => 'Steinway & Sons Model B Grand Piano',
                'description' => 'The Steinway Model B is a 6\' 11" grand piano often referred to as "the perfect piano." It\'s a favorite choice for serious pianists, offering the depth and richness of a full-size grand with a more manageable size.',
                'price' => 94999.99,
                'stock' => 1,
                'image' => 'steinway-model-b.jpg',
                'subcategory_id' => $pianoId,
                'status' => 'active'
            ],

            // Flutes
            [
                'name' => 'Yamaha YFL-222 Student Flute',
                'description' => 'The Yamaha YFL-222 student flute features a nickel-silver headjoint, body, and footjoint for durability and a beautiful tone. It has an offset G key and split E mechanism, making it easier for beginners to play.',
                'price' => 599.99,
                'stock' => 10,
                'image' => 'yamaha-flute.jpg',
                'subcategory_id' => $flutesId,
                'status' => 'active'
            ],
            [
                'name' => 'Pearl PF-665E Quantz Flute',
                'description' => 'The Pearl Quantz PF-665E flute features a sterling silver headjoint, silver-plated body and foot joint, French pointed arms, and an offset G key. It produces a warm, rich tone suitable for intermediate players.',
                'price' => 799.99,
                'stock' => 6,
                'image' => 'pearl-flute.jpg',
                'subcategory_id' => $flutesId,
                'status' => 'active'
            ],

            // DJ Equipment
            [
                'name' => 'Pioneer DJ DDJ-400 Controller',
                'description' => 'The Pioneer DJ DDJ-400 is a 2-channel DJ controller designed for beginners learning to DJ with Rekordbox. It features a layout inherited from Pioneer\'s professional club gear, making it easy to transition to pro equipment.',
                'price' => 249.99,
                'stock' => 15,
                'image' => 'pioneer-ddj400.jpg',
                'subcategory_id' => $djEquipId,
                'status' => 'active'
            ],
            [
                'name' => 'Numark Mixtrack Platinum FX DJ Controller',
                'description' => 'The Numark Mixtrack Platinum FX features 4-channel mixing, a built-in audio interface, and six FX paddle triggers. Its jog wheels display BPM, platter position, and track time information for seamless mixing.',
                'price' => 299.99,
                'stock' => 7,
                'image' => 'numark-mixtrack.jpg',
                'subcategory_id' => $djEquipId,
                'status' => 'active'
            ],

            // Strings
            [
                'name' => 'Ernie Ball Regular Slinky Electric Guitar Strings',
                'description' => 'Ernie Ball Regular Slinky electric guitar strings are made from nickel-plated steel wrapped around a tin-plated hex-shaped steel core. The gauges range from .010 to .046, providing a balanced tone for most playing styles.',
                'price' => 5.99,
                'stock' => 100,
                'image' => 'ernie-ball-strings.jpg',
                'subcategory_id' => $stringsId,
                'status' => 'active'
            ],
            [
                'name' => 'D\'Addario EJ16 Phosphor Bronze Acoustic Guitar Strings',
                'description' => 'D\'Addario EJ16 Phosphor Bronze acoustic guitar strings are known for their warm, bright, and well-balanced sound. The light gauge (.012-.053) provides comfortable playability while maintaining rich tone.',
                'price' => 6.99,
                'stock' => 100,
                'image' => 'daddario-strings.jpg',
                'subcategory_id' => $stringsId,
                'status' => 'active'
            ],

            // Cases
            [
                'name' => 'Gator GC-DREAD Deluxe Hardshell Guitar Case',
                'description' => 'The Gator GC-DREAD is a deluxe hardshell case designed for dreadnought acoustic guitars. It features a rugged wood construction with plush interior lining, offering superior protection for your instrument.',
                'price' => 99.99,
                'stock' => 20,
                'image' => 'gator-case.jpg',
                'subcategory_id' => $casesId,
                'status' => 'active'
            ],
            [
                'name' => 'SKB Injection Molded Electric Guitar Case',
                'description' => 'The SKB Injection Molded case features a waterproof, military-grade design that provides ultimate protection for electric guitars. Its trigger release latches and TSA-recognized locks make it ideal for traveling musicians.',
                'price' => 159.99,
                'stock' => 15,
                'image' => 'skb-case.jpg',
                'subcategory_id' => $casesId,
                'status' => 'active'
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Create more random products
        $subcategories = SubCategory::all();
        
        foreach ($subcategories as $subcategory) {
            // Create 3-5 products for each subcategory
            $count = rand(3, 5);
            for ($i = 0; $i < $count; $i++) {
                Product::create([
                    'name' => 'Premium ' . $subcategory->name . ' ' . ($i + 1),
                    'description' => 'This is a high-quality ' . strtolower($subcategory->name) . ' suitable for musicians of all skill levels.',
                    'price' => rand(5000, 500000) / 100, // Random price between $50 and $5000
                    'stock' => rand(1, 30),
                    'image' => strtolower(str_replace(' ', '-', $subcategory->name)) . '-' . ($i + 1) . '.jpg',
                    'subcategory_id' => $subcategory->id,
                    'status' => rand(0, 5) > 0 ? 'active' : 'inactive' // 1 in 6 chance of being inactive
                ]);
            }
        }
    }
}
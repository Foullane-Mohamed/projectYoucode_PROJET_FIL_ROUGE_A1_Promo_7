<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;

class SubCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get category IDs
        $stringId = Category::where('name', 'String Instruments')->first()->id;
        $windId = Category::where('name', 'Wind Instruments')->first()->id;
        $percussionId = Category::where('name', 'Percussion Instruments')->first()->id;
        $keyboardId = Category::where('name', 'Keyboard Instruments')->first()->id;
        $electronicId = Category::where('name', 'Electronic Instruments')->first()->id;
        $accessoriesId = Category::where('name', 'Accessories')->first()->id;

        // Define subcategories
        $subcategories = [
            // String Instruments
            [
                'name' => 'Guitars',
                'description' => 'Acoustic, electric, and classical guitars',
                'image' => 'guitars.jpg',
                'category_id' => $stringId
            ],
            [
                'name' => 'Violins',
                'description' => 'Violins and fiddles for all skill levels',
                'image' => 'violins.jpg',
                'category_id' => $stringId
            ],
            [
                'name' => 'Cellos',
                'description' => 'Cellos for beginners and professionals',
                'image' => 'cellos.jpg',
                'category_id' => $stringId
            ],
            [
                'name' => 'Basses',
                'description' => 'Electric and upright basses',
                'image' => 'basses.jpg',
                'category_id' => $stringId
            ],
            [
                'name' => 'Ukuleles',
                'description' => 'Soprano, concert, tenor, and baritone ukuleles',
                'image' => 'ukuleles.jpg',
                'category_id' => $stringId
            ],

            // Wind Instruments
            [
                'name' => 'Flutes',
                'description' => 'Western concert flutes and other flute types',
                'image' => 'flutes.jpg',
                'category_id' => $windId
            ],
            [
                'name' => 'Clarinets',
                'description' => 'B♭, A, E♭, and bass clarinets',
                'image' => 'clarinets.jpg',
                'category_id' => $windId
            ],
            [
                'name' => 'Saxophones',
                'description' => 'Soprano, alto, tenor, and baritone saxophones',
                'image' => 'saxophones.jpg',
                'category_id' => $windId
            ],
            [
                'name' => 'Trumpets',
                'description' => 'B♭, C, and pocket trumpets',
                'image' => 'trumpets.jpg',
                'category_id' => $windId
            ],
            [
                'name' => 'Trombones',
                'description' => 'Tenor and bass trombones',
                'image' => 'trombones.jpg',
                'category_id' => $windId
            ],

            // Percussion Instruments
            [
                'name' => 'Drums',
                'description' => 'Acoustic and electronic drum sets',
                'image' => 'drums.jpg',
                'category_id' => $percussionId
            ],
            [
                'name' => 'Cymbals',
                'description' => 'Crash, ride, hi-hat, and splash cymbals',
                'image' => 'cymbals.jpg',
                'category_id' => $percussionId
            ],
            [
                'name' => 'Tambourines',
                'description' => 'Handheld percussion instruments with small jingles',
                'image' => 'tambourines.jpg',
                'category_id' => $percussionId
            ],
            [
                'name' => 'Maracas',
                'description' => 'Rattles used in Latin American music',
                'image' => 'maracas.jpg',
                'category_id' => $percussionId
            ],
            [
                'name' => 'Congas',
                'description' => 'Tall, narrow, single-headed drums',
                'image' => 'congas.jpg',
                'category_id' => $percussionId
            ],

            // Keyboard Instruments
            [
                'name' => 'Pianos',
                'description' => 'Acoustic grand and upright pianos',
                'image' => 'pianos.jpg',
                'category_id' => $keyboardId
            ],
            [
                'name' => 'Digital Pianos',
                'description' => 'Electric pianos with weighted keys',
                'image' => 'digital-pianos.jpg',
                'category_id' => $keyboardId
            ],
            [
                'name' => 'Synthesizers',
                'description' => 'Electronic musical instruments that generate audio signals',
                'image' => 'synthesizers.jpg',
                'category_id' => $keyboardId
            ],
            [
                'name' => 'MIDI Controllers',
                'description' => 'Devices that generate and transmit MIDI data',
                'image' => 'midi-controllers.jpg',
                'category_id' => $keyboardId
            ],
            [
                'name' => 'Accordions',
                'description' => 'Free-reed instruments with a keyboard and bellows',
                'image' => 'accordions.jpg',
                'category_id' => $keyboardId
            ],

            // Electronic Instruments
            [
                'name' => 'Drum Machines',
                'description' => 'Electronic musical instruments that create percussion sounds',
                'image' => 'drum-machines.jpg',
                'category_id' => $electronicId
            ],
            [
                'name' => 'Samplers',
                'description' => 'Electronic instruments that use recordings of sounds',
                'image' => 'samplers.jpg',
                'category_id' => $electronicId
            ],
            [
                'name' => 'DJ Equipment',
                'description' => 'Turntables, mixers, and controllers for DJs',
                'image' => 'dj-equipment.jpg',
                'category_id' => $electronicId
            ],
            [
                'name' => 'Grooveboxes',
                'description' => 'Self-contained music production systems',
                'image' => 'grooveboxes.jpg',
                'category_id' => $electronicId
            ],
            [
                'name' => 'Electronic Wind Instruments',
                'description' => 'Digital wind controllers and instruments',
                'image' => 'electronic-wind.jpg',
                'category_id' => $electronicId
            ],

            // Accessories
            [
                'name' => 'Strings',
                'description' => 'Replacement strings for string instruments',
                'image' => 'strings.jpg',
                'category_id' => $accessoriesId
            ],
            [
                'name' => 'Picks',
                'description' => 'Guitar picks in various materials and thicknesses',
                'image' => 'picks.jpg',
                'category_id' => $accessoriesId
            ],
            [
                'name' => 'Tuners',
                'description' => 'Electronic devices for tuning instruments',
                'image' => 'tuners.jpg',
                'category_id' => $accessoriesId
            ],
            [
                'name' => 'Cases',
                'description' => 'Protective cases for instruments',
                'image' => 'cases.jpg',
                'category_id' => $accessoriesId
            ],
            [
                'name' => 'Sheet Music',
                'description' => 'Books and digital files of musical notation',
                'image' => 'sheet-music.jpg',
                'category_id' => $accessoriesId
            ]
        ];

        foreach ($subcategories as $subcategory) {
            SubCategory::create($subcategory);
        }
    }
}
<?php

namespace Database\Seeders;

use App\Models\Contact;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $contacts = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'subject' => 'Question about delivery times',
                'message' => 'Hello, I\'m interested in purchasing a guitar from your store, but I need to know the estimated delivery time to my location. I live in Chicago. Could you please provide me with this information? Thank you!',
                'status' => 'replied',
                'created_at' => Carbon::now()->subDays(25)
            ],
            [
                'name' => 'Emily Johnson',
                'email' => 'emily.johnson@example.com',
                'subject' => 'Missing item in my order',
                'message' => 'I recently received order #1234, but one of the items I ordered (a set of guitar strings) was missing from the package. Could you please help me resolve this issue? Thank you for your assistance.',
                'status' => 'replied',
                'created_at' => Carbon::now()->subDays(18)
            ],
            [
                'name' => 'Michael Brown',
                'email' => 'michael.brown@example.com',
                'subject' => 'Return policy question',
                'message' => 'I\'m interested in buying a keyboard from your store, but I\'m not sure if it will fit in my studio. What is your return policy if the item doesn\'t work for my space? Do you offer free returns? Thanks in advance for the information.',
                'status' => 'read',
                'created_at' => Carbon::now()->subDays(7)
            ],
            [
                'name' => 'Sarah Wilson',
                'email' => 'sarah.wilson@example.com',
                'subject' => 'Inquiry about custom instruments',
                'message' => 'Do you offer any custom instrument options? I\'m looking for a specific type of acoustic guitar with custom inlays and would like to know if this is something you can provide. I\'d appreciate any information on custom orders and the process involved.',
                'status' => 'read',
                'created_at' => Carbon::now()->subDays(5)
            ],
            [
                'name' => 'David Martinez',
                'email' => 'david.martinez@example.com',
                'subject' => 'Wholesale pricing inquiry',
                'message' => 'I own a music school and I\'m interested in purchasing multiple instruments for our students. Do you offer wholesale pricing or educational discounts for bulk orders? Please let me know what options are available. Thank you!',
                'status' => 'pending',
                'created_at' => Carbon::now()->subDays(2)
            ],
            [
                'name' => 'Jennifer Lee',
                'email' => 'jennifer.lee@example.com',
                'subject' => 'Product recommendation request',
                'message' => 'I\'m looking to buy a first instrument for my 10-year-old daughter who wants to learn music. Could you recommend some beginner-friendly options that would be suitable for a child her age? Preferably something durable that can grow with her skills. Thank you!',
                'status' => 'pending',
                'created_at' => Carbon::now()->subDays(1)
            ],
            [
                'name' => 'Robert Taylor',
                'email' => 'robert.taylor@example.com',
                'subject' => 'Website technical issue',
                'message' => 'I\'ve been trying to place an order on your website, but I keep getting an error message during the checkout process. I\'ve tried multiple browsers and devices with the same result. Could your technical team look into this issue? I\'d really like to complete my purchase.',
                'status' => 'pending',
                'created_at' => Carbon::now()->subHours(12)
            ],
            [
                'name' => 'Lisa Anderson',
                'email' => 'lisa.anderson@example.com',
                'subject' => 'International shipping question',
                'message' => 'Do you ship internationally? I\'m located in Australia and interested in purchasing several items from your store. If you do ship internationally, could you provide information about shipping costs and estimated delivery times? Thank you for your assistance.',
                'status' => 'pending',
                'created_at' => Carbon::now()->subHours(5)
            ]
        ];

        foreach ($contacts as $contact) {
            Contact::create($contact);
        }
    }
}
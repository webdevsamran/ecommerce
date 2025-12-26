<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Get categories
        $audio = Category::where('slug', 'audio')->first();
        $wearables = Category::where('slug', 'wearables')->first();
        $accessories = Category::where('slug', 'accessories')->first();
        $computer = Category::where('slug', 'computer')->first();
        $power = Category::where('slug', 'power')->first();

        $products = [
            [
                'sku' => 'AUDIO-001',
                'name' => 'Wireless Bluetooth Headphones',
                'description' => 'Premium noise-canceling headphones with 40-hour battery life. Features active noise cancellation, comfortable over-ear design, and crystal-clear audio quality.',
                'price' => 149.99,
                'stock_quantity' => 25,
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
                'categories' => [$audio?->id],
            ],
            [
                'sku' => 'WEAR-001',
                'name' => 'Smart Watch Pro',
                'description' => 'Advanced fitness tracker with heart rate monitor and GPS. Water-resistant up to 50m, with 7-day battery life and customizable watch faces.',
                'price' => 299.99,
                'stock_quantity' => 15,
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                'categories' => [$wearables?->id],
            ],
            [
                'sku' => 'PWR-001',
                'name' => 'Portable Power Bank',
                'description' => '20000mAh fast charging power bank with USB-C. Supports PD 65W charging for laptops and smartphones. Compact and lightweight design.',
                'price' => 49.99,
                'stock_quantity' => 50,
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
                'categories' => [$power?->id, $accessories?->id],
            ],
            [
                'sku' => 'COMP-001',
                'name' => 'Mechanical Keyboard',
                'description' => 'RGB backlit mechanical keyboard with Cherry MX switches. N-key rollover, programmable macros, and detachable wrist rest included.',
                'price' => 129.99,
                'stock_quantity' => 30,
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
                'categories' => [$computer?->id],
            ],
            [
                'sku' => 'COMP-002',
                'name' => 'Wireless Mouse',
                'description' => 'Ergonomic wireless mouse with precision tracking. 6 programmable buttons, adjustable DPI up to 16000, and 70-hour battery life.',
                'price' => 39.99,
                'stock_quantity' => 100,
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
                'categories' => [$computer?->id, $accessories?->id],
            ],
            [
                'sku' => 'ACC-001',
                'name' => 'USB-C Hub',
                'description' => '7-in-1 USB-C hub with HDMI 4K@60Hz, SD card reader, and 3x USB 3.0 ports. Aluminum body with 100W power delivery passthrough.',
                'price' => 59.99,
                'stock_quantity' => 40,
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
                'categories' => [$accessories?->id, $computer?->id],
            ],
            [
                'sku' => 'ACC-002',
                'name' => 'Laptop Stand',
                'description' => 'Adjustable aluminum laptop stand for better ergonomics. Supports laptops up to 17 inches with heat dissipation design.',
                'price' => 45.99,
                'stock_quantity' => 35,
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
                'categories' => [$accessories?->id, $computer?->id],
            ],
            [
                'sku' => 'COMP-003',
                'name' => 'Webcam HD Pro',
                'description' => '1080p HD webcam with built-in microphone and auto-focus. Privacy shutter, low-light correction, and flexible mounting options.',
                'price' => 89.99,
                'stock_quantity' => 20,
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400',
                'categories' => [$computer?->id],
            ],
            [
                'sku' => 'AUDIO-002',
                'name' => 'Wireless Earbuds',
                'description' => 'True wireless earbuds with active noise cancellation. IPX5 water-resistant, 28-hour total battery life with charging case.',
                'price' => 179.99,
                'stock_quantity' => 3, // Low stock for testing
                'featured' => true,
                'image' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
                'categories' => [$audio?->id],
            ],
            [
                'sku' => 'ACC-003',
                'name' => 'Monitor Light Bar',
                'description' => 'LED monitor light bar with adjustable color temperature. Auto-dimming, asymmetric optical design, and touch controls.',
                'price' => 69.99,
                'stock_quantity' => 5, // Low stock for testing
                'featured' => false,
                'image' => 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400',
                'categories' => [$accessories?->id, $computer?->id],
            ],
        ];

        foreach ($products as $productData) {
            $categories = $productData['categories'] ?? [];
            unset($productData['categories']);
            
            $product = Product::create($productData);
            
            if (!empty($categories)) {
                $product->categories()->attach(array_filter($categories));
            }
        }
    }
}

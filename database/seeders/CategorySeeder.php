<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Audio',
                'slug' => 'audio',
                'description' => 'Headphones, speakers, and audio equipment',
                'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            ],
            [
                'name' => 'Wearables',
                'slug' => 'wearables',
                'description' => 'Smart watches and fitness trackers',
                'image' => 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'description' => 'Cables, chargers, and peripherals',
                'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
            ],
            [
                'name' => 'Computer',
                'slug' => 'computer',
                'description' => 'Keyboards, mice, and computer peripherals',
                'image' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
            ],
            [
                'name' => 'Power',
                'slug' => 'power',
                'description' => 'Power banks and charging solutions',
                'image' => 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}

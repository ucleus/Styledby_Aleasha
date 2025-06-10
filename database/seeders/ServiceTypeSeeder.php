<?php

namespace Database\Seeders;

use App\Models\ServiceType;
use Illuminate\Database\Seeder;

class ServiceTypeSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Box Braids',
                'duration_min' => 180,
                'price_cents' => 15000,
                'description' => 'Classic box braids in various sizes',
            ],
            [
                'name' => 'Knotless Braids',
                'duration_min' => 240,
                'price_cents' => 20000,
                'description' => 'Tension-free knotless braids',
            ],
            [
                'name' => 'Cornrows',
                'duration_min' => 120,
                'price_cents' => 8000,
                'description' => 'Traditional cornrow styles',
            ],
            [
                'name' => 'Silk Press',
                'duration_min' => 90,
                'price_cents' => 7500,
                'description' => 'Smooth silk press and style',
            ],
            [
                'name' => 'Natural Hair Styling',
                'duration_min' => 120,
                'price_cents' => 10000,
                'description' => 'Twist outs, braid outs, and natural styles',
            ],
        ];

        foreach ($services as $service) {
            ServiceType::create($service);
        }
    }
}

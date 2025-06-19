<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ServiceType;
use App\Models\BusinessSetting;
use App\Models\BlockedDate;

class AdminDashboardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed default services
        $services = [
            [
                'name' => "Women's Cut & Style",
                'category' => 'Hair Cut',
                'duration_min' => 60,
                'price_cents' => 8500,
                'description' => 'Includes consultation, shampoo, precision cut, and style.',
                'is_active' => true
            ],
            [
                'name' => "Men's Cut & Style",
                'category' => 'Hair Cut',
                'duration_min' => 45,
                'price_cents' => 4500,
                'description' => 'Includes consultation, shampoo, precision cut, and style.',
                'is_active' => true
            ],
            [
                'name' => 'Color Service',
                'category' => 'Color',
                'duration_min' => 120,
                'price_cents' => 12000,
                'description' => 'Full color, balayage, highlights, or color correction.',
                'is_active' => true
            ],
            [
                'name' => 'Blowout & Style',
                'category' => 'Styling',
                'duration_min' => 45,
                'price_cents' => 5500,
                'description' => 'Shampoo, blow dry, and styling for any occasion.',
                'is_active' => true
            ],
            [
                'name' => 'Formal/Updo Styling',
                'category' => 'Styling',
                'duration_min' => 60,
                'price_cents' => 8500,
                'description' => 'Special occasion styling for weddings, proms, and events.',
                'is_active' => true
            ],
            [
                'name' => 'Deep Conditioning Treatment',
                'category' => 'Treatment',
                'duration_min' => 30,
                'price_cents' => 3500,
                'description' => 'Intensive repair and hydration for damaged hair.',
                'is_active' => true
            ]
        ];

        foreach ($services as $service) {
            ServiceType::updateOrCreate(
                ['name' => $service['name']],
                $service
            );
        }

        // Seed default business settings
        $settings = [
            ['key' => 'business_name', 'value' => 'Styles by Aleasha', 'type' => 'string', 'description' => 'Business name'],
            ['key' => 'business_phone', 'value' => '(555) 123-4567', 'type' => 'string', 'description' => 'Business phone number'],
            ['key' => 'business_email', 'value' => 'info@stylesbyaleasha.com', 'type' => 'string', 'description' => 'Business email'],
            ['key' => 'business_address', 'value' => '123 Main Street, City, State 12345', 'type' => 'string', 'description' => 'Business address'],
            ['key' => 'payment_processor', 'value' => 'stripe', 'type' => 'string', 'description' => 'Primary payment processor'],
            ['key' => 'require_deposit', 'value' => 'true', 'type' => 'boolean', 'description' => 'Require deposit for bookings'],
            ['key' => 'deposit_percentage', 'value' => '50', 'type' => 'integer', 'description' => 'Deposit percentage'],
            ['key' => 'booking_window', 'value' => '30', 'type' => 'integer', 'description' => 'Days in advance customers can book'],
            ['key' => 'cancel_window', 'value' => '24', 'type' => 'integer', 'description' => 'Hours before appointment cancellation allowed'],
            ['key' => 'working_hours', 'value' => '{"start":"09:00","end":"17:00"}', 'type' => 'json', 'description' => 'Default business hours'],
            ['key' => 'working_days', 'value' => '["monday","tuesday","wednesday","thursday","friday","saturday"]', 'type' => 'json', 'description' => 'Working days of the week'],
            ['key' => 'time_slot_interval', 'value' => '30', 'type' => 'integer', 'description' => 'Time slot interval in minutes'],
            ['key' => 'instagram', 'value' => '@stylesbyaleasha', 'type' => 'string', 'description' => 'Instagram handle'],
            ['key' => 'facebook', 'value' => 'facebook.com/stylesbyaleasha', 'type' => 'string', 'description' => 'Facebook page URL'],
            ['key' => 'website', 'value' => 'www.stylesbyaleasha.com', 'type' => 'string', 'description' => 'Website URL']
        ];

        foreach ($settings as $setting) {
            BusinessSetting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }

        // Seed some example blocked dates (holidays)
        $blockedDates = [
            ['blocked_date' => '2025-12-25', 'type' => 'full-day', 'reason' => 'Christmas Day'],
            ['blocked_date' => '2025-12-24', 'type' => 'full-day', 'reason' => 'Christmas Eve'],
            ['blocked_date' => '2025-01-01', 'type' => 'full-day', 'reason' => 'New Year\'s Day'],
            ['blocked_date' => '2025-07-04', 'type' => 'full-day', 'reason' => 'Independence Day'],
            ['blocked_date' => '2025-11-28', 'type' => 'full-day', 'reason' => 'Thanksgiving'],
        ];

        foreach ($blockedDates as $blockedDate) {
            BlockedDate::updateOrCreate(
                ['blocked_date' => $blockedDate['blocked_date']],
                $blockedDate
            );
        }

        $this->command->info('Admin dashboard data seeded successfully!');
        $this->command->info('✅ ' . count($services) . ' services created');
        $this->command->info('✅ ' . count($settings) . ' business settings created');
        $this->command->info('✅ ' . count($blockedDates) . ' blocked dates created');
    }
}

<?php

namespace Database\Seeders;

use App\Models\Diseases\DiseaseCategory;
use Illuminate\Database\Seeder;

class DiseaseCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nom' => 'Gynécologiques', 'slug' => 'gynecologiques', 'description' => 'Maladies touchant l\'appareil reproducteur féminin', 'icon' => '♀️', 'color' => '#ec4899', 'display_order' => 1],
            ['nom' => 'Hormonales', 'slug' => 'hormonales', 'description' => 'Troubles liés aux déséquilibres hormonaux', 'icon' => '⚖️', 'color' => '#8b5cf6', 'display_order' => 2],
            ['nom' => 'Infectieuses', 'slug' => 'infectieuses', 'description' => 'Infections et maladies transmissibles', 'icon' => '🦠', 'color' => '#ef4444', 'display_order' => 3],
            ['nom' => 'Cancérologie', 'slug' => 'cancerologie', 'description' => 'Cancers gynécologiques', 'icon' => '🎗️', 'color' => '#f59e0b', 'display_order' => 4],
            ['nom' => 'Grossesse', 'slug' => 'grossesse', 'description' => 'Complications et pathologies liées à la grossesse', 'icon' => '🤰', 'color' => '#06b6d4', 'display_order' => 5],
        ];

        foreach ($categories as $cat) {
            DiseaseCategory::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        $this->command->info('✅ Disease categories seeded');
    }
}
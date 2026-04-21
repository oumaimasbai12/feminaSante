<?php

namespace Database\Seeders;

use App\Models\Articles\ArticleCategory;
use Illuminate\Database\Seeder;

class ArticleCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nom' => 'Cycle menstruel', 'slug' => 'cycle-menstruel', 'icon' => '🌸', 'color' => '#ec4899', 'display_order' => 1, 'description' => 'Tout sur le suivi et la compréhension du cycle menstruel'],
            ['nom' => 'Grossesse', 'slug' => 'grossesse', 'icon' => '🤰', 'color' => '#06b6d4', 'display_order' => 2, 'description' => 'Conseils et informations pour un suivi de grossesse serein'],
            ['nom' => 'Ménopause', 'slug' => 'menopause', 'icon' => '🌿', 'color' => '#8b5cf6', 'display_order' => 3, 'description' => 'Accompagnement et bien-être pendant la ménopause'],
            ['nom' => 'Santé sexuelle', 'slug' => 'sante-sexuelle', 'icon' => '❤️', 'color' => '#ef4444', 'display_order' => 4, 'description' => 'Santé sexuelle et contraception'],
            ['nom' => 'Nutrition', 'slug' => 'nutrition', 'icon' => '🥗', 'color' => '#22c55e', 'display_order' => 5, 'description' => 'Alimentation et nutrition pour la santé féminine'],
            ['nom' => 'Bien-être mental', 'slug' => 'bien-etre-mental', 'icon' => '🧘', 'color' => '#f59e0b', 'display_order' => 6, 'description' => 'Santé mentale et émotionnelle'],
        ];

        foreach ($categories as $cat) {
            ArticleCategory::updateOrCreate(['slug' => $cat['slug']], $cat);
        }

        $this->command->info('✅ Article categories seeded');
    }
}
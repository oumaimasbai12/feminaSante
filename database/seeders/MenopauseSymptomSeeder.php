<?php

namespace Database\Seeders;

use App\Models\Menopause\MenopauseSymptom;
use Illuminate\Database\Seeder;

class MenopauseSymptomSeeder extends Seeder
{
    public function run(): void
    {
        foreach (config('menopause.symptoms', []) as $definition) {
            MenopauseSymptom::updateOrCreate(
                ['slug' => $definition['slug']],
                [
                    'name_fr' => $definition['name_fr'],
                    'category' => $definition['category'],
                    'sort_order' => $definition['sort_order'],
                    'is_active' => true,
                ]
            );
        }
    }
}

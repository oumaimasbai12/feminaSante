<?php

namespace Database\Factories;

use App\Models\Diseases\DiseaseCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DiseaseCategoryFactory extends Factory
{
    protected $model = DiseaseCategory::class;

    public function definition(): array
    {
        $nom = fake()->unique()->words(2, true);

        return [
            'nom' => Str::title($nom),
            'slug' => Str::slug($nom) . '-' . fake()->unique()->numberBetween(100, 999),
            'description' => fake()->sentence(),
            'icon' => 'health',
            'color' => '#E76F51',
            'parent_id' => null,
            'display_order' => fake()->numberBetween(0, 10),
        ];
    }
}

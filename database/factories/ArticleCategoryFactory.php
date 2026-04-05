<?php

namespace Database\Factories;

use App\Models\Articles\ArticleCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleCategoryFactory extends Factory
{
    protected $model = ArticleCategory::class;

    public function definition(): array
    {
        $nom = fake()->unique()->words(2, true);

        return [
            'nom' => $nom,
            'slug' => Str::slug($nom),
            'description' => fake()->sentence(),
            'icon' => '📁',
            'color' => '#FF5733',
            'display_order' => fake()->numberBetween(0, 10),
        ];
    }
}

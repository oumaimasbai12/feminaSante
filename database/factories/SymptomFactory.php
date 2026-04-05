<?php

namespace Database\Factories;

use App\Models\Symptom;
use Illuminate\Database\Eloquent\Factories\Factory;

class SymptomFactory extends Factory
{
    protected $model = Symptom::class;

    public function definition(): array
    {
        return [
            'nom' => fake()->unique()->word(),
            'category' => fake()->randomElement(['physical', 'emotional', 'other']),
            'icon' => '💊',
            'descriptions' => fake()->sentence(),
        ];
    }
}

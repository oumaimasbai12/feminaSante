<?php

namespace Database\Factories;

use App\Models\Pregnancy\Pregnancy;
use App\Models\Pregnancy\PregnancySymptom;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PregnancySymptom>
 */
class PregnancySymptomFactory extends Factory
{
    protected $model = PregnancySymptom::class;

    public function definition(): array
    {
        return [
            'pregnancy_id' => Pregnancy::factory(),
            'name' => fake()->randomElement(config('pregnancy.symptoms')),
            'intensity' => fake()->randomElement(['faible', 'modéré', 'élevé', 'intense']),
            'notes' => null,
            'recorded_at' => now(),
        ];
    }
}

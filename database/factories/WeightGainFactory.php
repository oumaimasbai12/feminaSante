<?php

namespace Database\Factories;

use App\Models\Pregnancy\Pregnancy;
use App\Models\Pregnancy\WeightGain;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WeightGain>
 */
class WeightGainFactory extends Factory
{
    protected $model = WeightGain::class;

    public function definition(): array
    {
        return [
            'pregnancy_id' => Pregnancy::factory(),
            'date' => fake()->date(),
            'week' => fake()->numberBetween(1, 42),
            'weight' => fake()->randomFloat(2, 50, 120),
            'bmi' => fake()->randomFloat(1, 18, 35),
            'notes' => null,
        ];
    }
}

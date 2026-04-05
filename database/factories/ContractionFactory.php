<?php

namespace Database\Factories;

use App\Models\Pregnancy\Contraction;
use App\Models\Pregnancy\Pregnancy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Contraction>
 */
class ContractionFactory extends Factory
{
    protected $model = Contraction::class;

    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('-1 month', 'now');

        return [
            'pregnancy_id' => Pregnancy::factory(),
            'start_time' => $startTime->format('Y-m-d H:i:s'),
            'end_time' => (clone $startTime)->modify('+60 seconds')->format('Y-m-d H:i:s'),
            'duration_seconds' => fake()->numberBetween(30, 90),
            'interval_seconds' => fake()->numberBetween(120, 600),
            'intensity' => fake()->randomElement(['mild', 'moderate', 'strong', 'very strong']),
            'is_active' => true,
            'notes' => null,
        ];
    }
}

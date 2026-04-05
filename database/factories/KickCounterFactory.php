<?php

namespace Database\Factories;

use App\Models\Pregnancy\KickCounter;
use App\Models\Pregnancy\Pregnancy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KickCounter>
 */
class KickCounterFactory extends Factory
{
    protected $model = KickCounter::class;

    public function definition(): array
    {
        return [
            'pregnancy_id' => Pregnancy::factory(),
            'date' => fake()->date(),
            'start_time' => '10:00:00',
            'end_time' => '10:30:00',
            'kicks_count' => fake()->numberBetween(5, 30),
            'time_to_10_kicks' => fake()->randomElement(['<30min', '30-60min', '1-2hours', '>2hours']),
            'activity_level' => fake()->randomElement(['low', 'normal', 'high']),
            'notes' => null,
        ];
    }
}

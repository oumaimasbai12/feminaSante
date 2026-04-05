<?php

namespace Database\Factories;

use App\Models\Cycle;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CycleFactory extends Factory
{
    protected $model = Cycle::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-3 months', 'now');
        $endDate = (clone $startDate)->modify('+5 days');

        return [
            'user_id' => User::factory(),
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'phase' => 'menstruation',
            'flow_intensity' => fake()->randomElement(['light', 'medium', 'heavy']),
            'mood' => fake()->randomElement(['happy', 'sad', 'irritable', 'anxious', 'calm', 'other']),
            'notes' => null,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Menopause\Menopause;
use App\Models\Menopause\MenopauseTreatment;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenopauseTreatmentFactory extends Factory
{
    protected $model = MenopauseTreatment::class;

    public function definition(): array
    {
        return [
            'menopause_id' => Menopause::factory(),
            'treatment_type' => fake()->randomElement(['medication', 'therapy', 'lifestyle', 'supplement', 'alternative', 'monitoring']),
            'name' => fake()->randomElement(['Hormone therapy', 'Magnesium', 'Sleep coaching', 'Exercise plan']),
            'description' => fake()->optional()->sentence(),
            'start_date' => fake()->dateTimeBetween('-6 months', 'now'),
            'end_date' => fake()->optional()->dateTimeBetween('now', '+3 months'),
            'status' => fake()->randomElement(['planned', 'active', 'completed', 'stopped']),
            'relieves_hot_flashes' => fake()->boolean(),
            'relieves_sleep_changes' => fake()->boolean(),
            'relieves_mood_changes' => fake()->boolean(),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}

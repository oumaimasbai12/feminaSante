<?php

namespace Database\Factories;

use App\Models\Menopause\Menopause;
use App\Models\Menopause\MenopauseSymptomLog;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenopauseSymptomLogFactory extends Factory
{
    protected $model = MenopauseSymptomLog::class;

    public function definition(): array
    {
        return [
            'menopause_id' => Menopause::factory(),
            'log_date' => fake()->dateTimeBetween('-3 months', 'now'),
            'symptoms' => fake()->randomElements([
                'hot flashes',
                'night sweats',
                'sleep changes',
                'brain fog',
                'low energy',
            ], fake()->numberBetween(1, 3)),
            'severity' => fake()->randomElement(['mild', 'moderate', 'severe']),
            'sleep_quality' => fake()->numberBetween(1, 10),
            'mood_score' => fake()->numberBetween(1, 10),
            'hot_flashes' => fake()->boolean(),
            'night_sweats' => fake()->boolean(),
            'mood_changes' => fake()->boolean(),
            'sleep_changes' => fake()->boolean(),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}

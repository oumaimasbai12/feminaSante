<?php

namespace Database\Factories;

use App\Models\Menopause\Menopause;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenopauseFactory extends Factory
{
    protected $model = Menopause::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'last_period_date' => fake()->dateTimeBetween('-2 years', '-6 months'),
            'diagnosis_date' => fake()->dateTimeBetween('-1 year', 'now'),
            'stage' => fake()->randomElement(['perimenopause', 'menopause', 'postmenopause']),
            'status' => fake()->randomElement(['ongoing', 'completed']),
            'symptoms' => fake()->randomElements([
                'hot flashes',
                'night sweats',
                'sleep changes',
                'mood changes',
                'vaginal dryness',
            ], fake()->numberBetween(1, 3)),
            'cycle_irregularity' => fake()->boolean(),
            'hot_flashes' => fake()->boolean(),
            'night_sweats' => fake()->boolean(),
            'mood_changes' => fake()->boolean(),
            'sleep_changes' => fake()->boolean(),
            'hormone_therapy' => fake()->boolean(),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}

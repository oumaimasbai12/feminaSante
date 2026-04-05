<?php

namespace Database\Factories;

use App\Models\AppNotification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppNotificationFactory extends Factory
{
    protected $model = AppNotification::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['appointment', 'cycle', 'pregnancy', 'medication']),
            'title' => fake()->sentence(4),
            'message' => fake()->paragraph(),
            'data' => ['source' => fake()->word()],
            'read_at' => null,
        ];
    }
}

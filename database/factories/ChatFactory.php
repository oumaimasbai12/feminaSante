<?php

namespace Database\Factories;

use App\Models\Assistant\Chat;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ChatFactory extends Factory
{
    protected $model = Chat::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'session_id' => Str::uuid()->toString(),
            'message' => fake()->sentence(),
            'response' => fake()->paragraph(),
            'intent' => 'general',
            'sentiment' => 'neutral',
            'context' => [],
            'completed_at' => now(),
        ];
    }
}

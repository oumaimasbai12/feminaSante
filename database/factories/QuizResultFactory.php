<?php

namespace Database\Factories;

use App\Models\Quiz\Quiz;
use App\Models\Quiz\QuizResult;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuizResultFactory extends Factory
{
    protected $model = QuizResult::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'quiz_id' => Quiz::factory(),
            'score' => fake()->numberBetween(0, 10),
            'total_points' => 10,
            'percentage' => fake()->randomFloat(2, 0, 100),
            'answers' => [],
            'time_spent' => fake()->numberBetween(30, 300),
            'completed_at' => now(),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Quiz\Question;
use App\Models\Quiz\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

class QuestionFactory extends Factory
{
    protected $model = Question::class;

    public function definition(): array
    {
        return [
            'quiz_id' => Quiz::factory(),
            'question_text' => fake()->sentence() . '?',
            'type' => 'single',
            'points' => 1,
            'display_order' => fake()->numberBetween(1, 20),
            'explanation' => fake()->sentence(),
            'img_url' => null,
        ];
    }
}

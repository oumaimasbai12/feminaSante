<?php

namespace Database\Factories;

use App\Models\Quiz\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class QuizFactory extends Factory
{
    protected $model = Quiz::class;

    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . time() . fake()->randomNumber(4),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(['cycle', 'pregnancy', 'diseases', 'contraception', 'nutrition', 'general']),
            'difficulty' => 'beginner',
            'image_url' => null,
            'time_limit' => 300,
            'passing_score' => 70,
            'attempt_count' => 0,
            'average_score' => null,
        ];
    }
}

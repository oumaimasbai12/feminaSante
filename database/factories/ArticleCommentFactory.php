<?php

namespace Database\Factories;

use App\Models\Articles\Article;
use App\Models\Articles\ArticleComment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ArticleCommentFactory extends Factory
{
    protected $model = ArticleComment::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'article_id' => Article::factory(),
            'parent_id' => null,
            'content' => fake()->paragraph(),
            'is_approved' => true,
            'likes_count' => 0,
        ];
    }
}

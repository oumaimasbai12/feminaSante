<?php

namespace Database\Factories;

use App\Models\Articles\Article;
use App\Models\Articles\ArticleCategory;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ArticleFactory extends Factory
{
    protected $model = Article::class;

    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . time() . fake()->randomNumber(4),
            'excerpt' => fake()->paragraph(),
            'content' => fake()->paragraphs(3, true),
            'category_id' => ArticleCategory::factory(),
            'featured_image' => null,
            'tags' => ['santé', 'femme'],
            'status' => 'published',
            'published_at' => now(),
            'author_id' => User::factory(),
            'views_count' => 0,
            'likes_count' => 0,
            'shares_count' => 0,
            'read_time' => fake()->numberBetween(2, 15),
            'meta_data' => null,
            'is_featured' => false,
            'is_premium' => false,
        ];
    }
}

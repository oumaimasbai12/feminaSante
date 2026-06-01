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
        
        $content = '<h2 class="text-xl font-bold text-slate-900 mb-3">' . fake()->sentence(5) . '</h2>';
        $content .= '<p class="mb-4">' . fake()->paragraph(3) . '</p>';
        $content .= '<p class="mb-4">' . fake()->paragraph(2) . '</p>';
        $content .= '<h3 class="text-lg font-semibold text-slate-800 mb-2 mt-6">' . fake()->sentence(4) . '</h3>';
        $content .= '<p class="mb-4">' . fake()->paragraph(3) . '</p>';
        $content .= '<ul class="list-disc list-inside mb-4 space-y-1">';
        $content .= '<li>' . fake()->sentence(4) . '</li>';
        $content .= '<li>' . fake()->sentence(5) . '</li>';
        $content .= '<li>' . fake()->sentence(3) . '</li>';
        $content .= '</ul>';
        $content .= '<p class="mb-4">' . fake()->paragraph(2) . '</p>';
        $content .= '<h3 class="text-lg font-semibold text-slate-800 mb-2 mt-6">' . fake()->sentence(4) . '</h3>';
        $content .= '<p class="mb-4">' . fake()->paragraph(3) . '</p>';
        $content .= '<p>' . fake()->paragraph(2) . '</p>';

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . time() . fake()->randomNumber(4),
            'excerpt' => fake()->paragraph(2),
            'content' => $content,
            'category_id' => ArticleCategory::factory(),
            'featured_image' => null,
            'tags' => ['santé', 'femme', fake()->word(), fake()->word()],
            'status' => 'published',
            'published_at' => now(),
            'author_id' => User::factory(),
            'views_count' => 0,
            'likes_count' => 0,
            'shares_count' => 0,
            'read_time' => fake()->numberBetween(5, 12),
            'meta_data' => null,
            'is_featured' => false,
            'is_premium' => false,
        ];
    }
}

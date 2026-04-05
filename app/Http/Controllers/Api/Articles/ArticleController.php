<?php

namespace App\Http\Controllers\Api\Articles;

use App\Http\Controllers\Controller;
use App\Models\Articles\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ArticleController extends Controller
{
    public function index(): JsonResponse
    {
        $articles = Article::with(['category', 'author'])
            ->latest()
            ->get();

        return response()->json($articles);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['nullable', 'string'],
            'content' => ['required', 'string'],
            'category_id' => ['nullable', 'exists:article_categories,id'],
            'featured_image' => ['nullable', 'string'],
            'tags' => ['nullable', 'array'],
            'status' => ['nullable', 'in:draft,published,archived'],
            'published_at' => ['nullable', 'date'],
            'read_time' => ['nullable', 'integer'],
            'meta_data' => ['nullable', 'array'],
            'is_featured' => ['nullable', 'boolean'],
            'is_premium' => ['nullable', 'boolean'],
        ]);

        $article = Article::create([
            ...$data,
            'slug' => Str::slug($data['title']) . '-' . time(),
            'author_id' => $request->user()->id,
            'status' => $data['status'] ?? 'draft',
            'views_count' => 0,
            'likes_count' => 0,
            'shares_count' => 0,
            'is_featured' => $data['is_featured'] ?? false,
            'is_premium' => $data['is_premium'] ?? false,
        ]);

        return response()->json([
            'message' => 'Article created successfully.',
            'article' => $article->load(['category', 'author']),
        ], 201);
    }

    public function show(Article $article): JsonResponse
    {
        $article->increment('views_count');

        return response()->json(
            $article->load(['category', 'author', 'comments.user'])
        );
    }
}

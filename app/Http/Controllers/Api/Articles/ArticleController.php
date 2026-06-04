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
            'excerpt' => ['required', 'string'],
            'content' => ['required', 'string'],
            'category_id' => ['required', 'exists:article_categories,id'],
            'featured_image' => ['nullable', 'string'],
            'tags' => ['required', 'array', 'min:1'],
            'tags.*' => ['required', 'string'],
            'status' => ['nullable', 'in:draft,published,archived'],
            'published_at' => ['nullable', 'date'],
            'read_time' => ['nullable', 'integer'],
            'meta_data' => ['nullable', 'array'],
            'is_featured' => ['nullable', 'boolean'],
            'is_premium' => ['nullable', 'boolean'],
        ]);

        $status = $data['status'] ?? 'draft';
        $publishedAt = $data['published_at'] ?? null;
        if ($status === 'published' && $publishedAt === null) {
            $publishedAt = now();
        }

        $article = Article::create([
            ...$data,
            'slug' => Str::slug($data['title']) . '-' . time(),
            'author_id' => $request->user()->id,
            'status' => $status,
            'published_at' => $publishedAt,
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

    public function show(Request $request, Article $article): JsonResponse
    {
        $article->increment('views_count');
        $user = $request->user();
        
        $isLiked = $user ? $article->likedByUsers()->where('user_id', $user->id)->exists() : false;

        $articleData = $article->load(['category', 'author', 'comments.user'])->toArray();

        return response()->json(array_merge($articleData, [
            'is_liked' => $isLiked
        ]));
    }
    public function update(Request $request, Article $article): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string'],
            'content' => ['required', 'string'],
            'category_id' => ['required', 'exists:article_categories,id'],
            'tags' => ['required', 'array', 'min:1'],
            'tags.*' => ['required', 'string'],
            'status' => ['nullable', 'in:draft,published,archived'],
            'published_at' => ['nullable', 'date'],
            'is_featured' => ['nullable', 'boolean'],
            'is_premium' => ['nullable', 'boolean'],
            'read_time' => ['nullable', 'integer'],
        ]);

        if (($data['status'] ?? $article->status) === 'published'
            && empty($data['published_at'])
            && $article->published_at === null) {
            $data['published_at'] = now();
        }

        $article->update($data);
        return response()->json([
            'message' => 'Article updated.',
            'article' => $article->load(['category', 'author']),
        ]);
    }

    public function destroy(Article $article): JsonResponse
    {
        $article->delete();
        return response()->json(['message' => 'Article deleted.']);
    }
}

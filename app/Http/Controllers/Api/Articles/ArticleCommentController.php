<?php

namespace App\Http\Controllers\Api\Articles;

use App\Http\Controllers\Controller;
use App\Models\Articles\Article;
use App\Models\Articles\ArticleComment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleCommentController extends Controller
{
   /* public function store(Request $request, Article $article): JsonResponse
    {
        $data = $request->validate([
            'content' => ['required', 'string'],
            'parent_id' => ['nullable', 'exists:article_comments,id'],
        ]);

        $comment = ArticleComment::create([
            'user_id' => $request->user()->id,
            'article_id' => $article->id,
            'parent_id' => $data['parent_id'] ?? null,
            'content' => $data['content'],
            'is_approved' => true,
            'likes_count' => 0,
        ]);

        return response()->json([
            'message' => 'Comment created successfully.',
            'comment' => $comment->load('user'),
        ], 201);
    }*/
   /* public function store(Request $request, Article $article): JsonResponse
    {
        return response()->json([
            'message' => 'Comment route reached.',
            'article_id' => $article->id,
            'user_id' => $request->user()?->id,
        ]);
    }*/
    public function store(Request $request, Article $article): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $data = $request->validate([
            'content' => ['required', 'string'],
            'parent_id' => ['nullable', 'exists:article_comments,id'],
        ]);

        $comment = ArticleComment::create([
            'user_id' => $user->id,
            'article_id' => $article->id,
            'parent_id' => $data['parent_id'] ?? null,
            'content' => $data['content'],
            'is_approved' => true,
            'likes_count' => 0,
        ]);

        return response()->json([
            'message' => 'Comment created successfully.',
            'comment' => $comment->load('user'),
        ], 201);
    }
}

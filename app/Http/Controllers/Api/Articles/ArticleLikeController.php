<?php

namespace App\Http\Controllers\Api\Articles;

use App\Http\Controllers\Controller;
use App\Models\Articles\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ArticleLikeController extends Controller
{
    public function toggle(Request $request, Article $article): JsonResponse
    {
        $user = $request->user();
        $isLiked = $article->likedByUsers()->where('user_id', $user->id)->exists();

        if ($isLiked) {
            $article->likedByUsers()->detach($user->id);
            $article->decrement('likes_count');
        } else {
            $article->likedByUsers()->attach($user->id);
            $article->increment('likes_count');
        }

        return response()->json([
            'is_liked' => !$isLiked,
            'likes_count' => $article->likes_count
        ]);
    }

    public function share(Request $request, Article $article): JsonResponse
    {
        $article->increment('shares_count');
        
        return response()->json([
            'message' => 'Article shared successfully',
            'shares_count' => $article->shares_count
        ]);
    }
}

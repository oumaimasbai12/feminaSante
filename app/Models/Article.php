<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Article extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'category_id',
        'featured_image',
        'tags',
        'status',
        'published_at',
        'author_id',
        'views_count',
        'likes_count',
        'shares_count',
        'read_time',
        'meta_data',
        'is_featured',
        'is_premium',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'meta_data' => 'array',
            'published_at' => 'datetime',
            'is_featured' => 'boolean',
            'is_premium' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ArticleCategory::class, 'category_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ArticleComment::class, 'article_id');
    }

    public function likedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'article_likes')
            ->withTimestamps();
    }
}


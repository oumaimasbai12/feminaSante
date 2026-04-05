<?php

namespace App\Models\Articles;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ArticleLike extends Pivot
{
    protected $table = 'article_likes';

    public $incrementing = false;
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'article_id',
    ];
}

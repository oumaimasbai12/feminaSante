<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class ArticleLike extends Pivot
{
    protected $table = 'article_likes';

    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'article_id',
    ];
}


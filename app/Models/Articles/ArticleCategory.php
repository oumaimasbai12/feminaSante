<?php

namespace App\Models\Articles;

use Database\Factories\ArticleCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ArticleCategory extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'nom',
        'slug',
        'description',
        'icon',
        'color',
        'display_order',
    ];

    public function articles(): HasMany
    {
        return $this->hasMany(Article::class, 'category_id');
    }

    protected static function newFactory(): Factory
    {
        return ArticleCategoryFactory::new();
    }
}

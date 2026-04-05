<?php

namespace App\Models\Quiz;

use Database\Factories\QuizFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'category',
        'difficulty',
        'image_url',
        'time_limit',
        'passing_score',
        'attempt_count',
        'average_score',
    ];

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(QuizResult::class);
    }

    protected static function newFactory(): Factory
    {
        return QuizFactory::new();
    }
}

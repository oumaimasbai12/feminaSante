<?php

namespace App\Models\Quiz;

use Database\Factories\QuestionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Question extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'quiz_id',
        'question_text',
        'type',
        'points',
        'display_order',
        'explanation',
        'img_url',
    ];

    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(QuestionOption::class);
    }

    protected static function newFactory(): Factory
    {
        return QuestionFactory::new();
    }
}

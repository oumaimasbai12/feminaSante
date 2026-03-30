<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chat extends Model
{
    protected $fillable = [
        'user_id',
        'session_id',
        'message',
        'response',
        'intent',
        'sentiment',
        'context',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'context' => 'array',
            'completed_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

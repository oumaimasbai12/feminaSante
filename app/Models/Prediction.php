<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prediction extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'predicted_date',
        'type',
        'confidence',
        'cycle_length_avg',
    ];

    protected function casts(): array
    {
        return [
            'predicted_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

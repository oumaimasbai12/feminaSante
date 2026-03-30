<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    protected $fillable = [
        'user_id',
        'gynecologist_id',
        'start_time',
        'end_time',
        'status',
        'consultation_type',
        'reason',
        'notes',
        'is_first_visit',
        'cancellation_reason',
        'rating',
        'review',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'is_first_visit' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function gynecologist(): BelongsTo
    {
        return $this->belongsTo(Gynecologist::class);
    }
}

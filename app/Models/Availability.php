<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Availability extends Model
{
    protected $fillable = [
        'gynecologist_id',
        'date',
        'start_time',
        'end_time',
        'is_available',
        'recurrence',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_available' => 'boolean',
        ];
    }

    public function gynecologist(): BelongsTo
    {
        return $this->belongsTo(Gynecologist::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KickCounter extends Model
{
    protected $fillable = [
        'pregnancy_id',
        'date',
        'start_time',
        'end_time',
        'kicks_count',
        'time_to_10_kicks',
        'activity_level',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }

    public function pregnancy(): BelongsTo
    {
        return $this->belongsTo(Pregnancy::class);
    }
}

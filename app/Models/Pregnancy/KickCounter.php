<?php

namespace App\Models\Pregnancy;

use Database\Factories\KickCounterFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KickCounter extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

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

    protected static function newFactory(): Factory
    {
        return KickCounterFactory::new();
    }
}

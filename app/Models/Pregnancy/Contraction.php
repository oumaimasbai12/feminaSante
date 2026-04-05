<?php

namespace App\Models\Pregnancy;

use Database\Factories\ContractionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contraction extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'pregnancy_id',
        'start_time',
        'end_time',
        'duration_seconds',
        'interval_seconds',
        'intensity',
        'is_active',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    public function pregnancy(): BelongsTo
    {
        return $this->belongsTo(Pregnancy::class);
    }

    protected static function newFactory(): Factory
    {
        return ContractionFactory::new();
    }
}

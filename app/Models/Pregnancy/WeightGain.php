<?php

namespace App\Models\Pregnancy;

use Database\Factories\WeightGainFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WeightGain extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'pregnancy_id',
        'date',
        'week',
        'weight',
        'bmi',
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
        return WeightGainFactory::new();
    }
}

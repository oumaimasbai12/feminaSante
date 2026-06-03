<?php

namespace App\Models\Pregnancy;

use Database\Factories\PregnancySymptomFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PregnancySymptom extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'pregnancy_id',
        'name',
        'intensity',
        'notes',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'recorded_at' => 'datetime',
        ];
    }

    public function pregnancy(): BelongsTo
    {
        return $this->belongsTo(Pregnancy::class);
    }

    protected static function newFactory(): Factory
    {
        return PregnancySymptomFactory::new();
    }
}

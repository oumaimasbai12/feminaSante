<?php

namespace App\Models\Menopause;

use App\Enums\Menopause\MenopauseSymptomSeverityEnum;
use Database\Factories\MenopauseSymptomLogFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenopauseSymptomLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'menopause_id',
        'log_date',
        'symptoms',
        'severity',
        'sleep_quality',
        'mood_score',
        'hot_flashes',
        'night_sweats',
        'mood_changes',
        'sleep_changes',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'log_date' => 'date',
            'severity' => MenopauseSymptomSeverityEnum::class,
            'symptoms' => 'array',
            'hot_flashes' => 'boolean',
            'night_sweats' => 'boolean',
            'mood_changes' => 'boolean',
            'sleep_changes' => 'boolean',
        ];
    }

    public function menopause(): BelongsTo
    {
        return $this->belongsTo(Menopause::class);
    }

    protected static function newFactory(): Factory
    {
        return MenopauseSymptomLogFactory::new();
    }
}

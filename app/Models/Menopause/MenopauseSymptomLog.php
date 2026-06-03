<?php

namespace App\Models\Menopause;

use App\Enums\Menopause\MenopauseSymptomSeverityEnum;
use Database\Factories\MenopauseSymptomLogFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        'stress_level',
        'caffeine_cups',
        'exercise_minutes',
        'alcohol_units',
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

    /** Pivot to predefined symptom catalog (menopause_symptom_log_symptom). */
    public function catalogSymptoms(): BelongsToMany
    {
        return $this->belongsToMany(
            MenopauseSymptom::class,
            'menopause_symptom_log_symptom',
            'menopause_symptom_log_id',
            'menopause_symptom_id'
        )->withPivot('intensity')->withTimestamps();
    }

    protected static function newFactory(): Factory
    {
        return MenopauseSymptomLogFactory::new();
    }
}

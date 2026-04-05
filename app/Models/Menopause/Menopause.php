<?php

namespace App\Models\Menopause;

use App\Enums\Menopause\MenopauseStageEnum;
use App\Enums\Menopause\MenopauseStatusEnum;
use Database\Factories\MenopauseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;

class Menopause extends Model
{
    use HasFactory;

    protected $withCount = [
        'symptomLogs',
        'treatments',
    ];

    protected $fillable = [
        'user_id',
        'last_period_date',
        'diagnosis_date',
        'stage',
        'status',
        'symptoms',
        'cycle_irregularity',
        'hot_flashes',
        'night_sweats',
        'mood_changes',
        'sleep_changes',
        'hormone_therapy',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'last_period_date' => 'date',
            'diagnosis_date' => 'date',
            'stage' => MenopauseStageEnum::class,
            'status' => MenopauseStatusEnum::class,
            'symptoms' => 'array',
            'cycle_irregularity' => 'boolean',
            'hot_flashes' => 'boolean',
            'night_sweats' => 'boolean',
            'mood_changes' => 'boolean',
            'sleep_changes' => 'boolean',
            'hormone_therapy' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function symptomLogs(): HasMany
    {
        return $this->hasMany(MenopauseSymptomLog::class);
    }

    public function treatments(): HasMany
    {
        return $this->hasMany(MenopauseTreatment::class);
    }

    protected static function newFactory(): Factory
    {
        return MenopauseFactory::new();
    }
}

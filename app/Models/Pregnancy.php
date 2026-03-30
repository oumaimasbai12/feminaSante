<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pregnancy extends Model
{
    protected $fillable = [
        'user_id',
        'start_date',
        'due_date',
        'conception_date',
        'pregnancy_type',
        'status',
        'high_risk',
        'risk_factors',
        'blood_type',
        'rhesus_negative',
        'allergies',
        'medical_conditions',
        'notes',
    ];

    protected $appends = [
        'current_week',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'due_date' => 'date',
            'conception_date' => 'date',
            'high_risk' => 'boolean',
            'rhesus_negative' => 'boolean',
            'allergies' => 'array',
            'medical_conditions' => 'array',
        ];
    }

    public function getCurrentWeekAttribute(): ?int
    {
        if (! $this->start_date) {
            return null;
        }

        return max(1, (int) floor($this->start_date->diffInDays(now()) / 7) + 1);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function checkups(): HasMany
    {
        return $this->hasMany(PregnancyCheckup::class);
    }

    public function kickCounters(): HasMany
    {
        return $this->hasMany(KickCounter::class);
    }

    public function contractions(): HasMany
    {
        return $this->hasMany(Contraction::class);
    }

    public function weightGains(): HasMany
    {
        return $this->hasMany(WeightGain::class);
    }
}

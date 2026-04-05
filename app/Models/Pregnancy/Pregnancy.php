<?php

namespace App\Models\Pregnancy;

use App\Models\User;
use Database\Factories\PregnancyFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pregnancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'start_date',
        'due_date',
        'conception_date',
        'pregnancy_type',
        'statuts',
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

    public function getStatusAttribute(): ?string
    {
        return $this->attributes['statuts'] ?? null;
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

    protected static function newFactory(): Factory
    {
        return PregnancyFactory::new();
    }
}

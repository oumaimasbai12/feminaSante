<?php

namespace App\Models\Appointments;

use Database\Factories\GynecologistFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gynecologist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'speciality',
        'license_number',
        'email',
        'phone',
        'adress',
        'city',
        'postal_code',
        'consultation_type',
        'consultation_duration',
        'consultation_fee',
        'bio',
        'languages_spoken',
        'rating',
        'review_count',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'consultation_type' => 'array',
            'languages_spoken' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function getAddressAttribute(): ?string
    {
        return $this->attributes['adress'] ?? null;
    }

    public function setAddressAttribute(?string $value): void
    {
        $this->attributes['adress'] = $value;
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(Availability::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function clinicalNotes(): HasMany
    {
        return $this->hasMany(ClinicalNote::class);
    }

    public function patientPriorities(): HasMany
    {
        return $this->hasMany(GynecologistPatientPriority::class);
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function syncActiveFromAvailabilities(): void
    {
        $hasFutureAvailability = $this->availabilities()
            ->where('is_available', true)
            ->whereDate('date', '>=', now()->toDateString())
            ->exists();

        $this->update(['is_active' => $hasFutureAvailability]);
    }

    public function scopeByCity(Builder $query, ?string $city): Builder
    {
        if (! $city) {
            return $query;
        }

        return $query->where('city', 'like', '%'.$city.'%');
    }

    public function scopeBySpeciality(Builder $query, ?string $speciality): Builder
    {
        if (! $speciality) {
            return $query;
        }

        return $query->where('speciality', 'like', '%'.$speciality.'%');
    }

    protected static function newFactory(): Factory
    {
        return GynecologistFactory::new();
    }
}

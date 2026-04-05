<?php

namespace App\Models\Appointments;

use Database\Factories\GynecologistFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gynecologist extends Model
{
    use HasFactory;

    protected $fillable = [
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

    protected static function newFactory(): Factory
    {
        return GynecologistFactory::new();
    }
}

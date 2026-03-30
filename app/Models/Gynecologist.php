<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gynecologist extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'speciality',
        'license_number',
        'email',
        'phone',
        'address',
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

    public function availabilities(): HasMany
    {
        return $this->hasMany(Availability::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}

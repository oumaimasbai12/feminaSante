<?php

namespace App\Models;

use App\Models\Menopause\Menopause;
use App\Models\Pregnancy\Pregnancy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'email',
        'motDePasse',
        'birth_date',
        'gender',
        'blood_type',
        'emergency_contacts',
        'medical_history',
        'notification_settings',
        'langage',
    ];

    protected $hidden = [
        'motDePasse',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'birth_date' => 'date',
            'emergency_contacts' => 'array',
            'medical_history' => 'array',
            'notification_settings' => 'array',
            'motDePasse' => 'hashed',
        ];
    }

    public function getNameAttribute(): ?string
    {
        return $this->attributes['nom'] ?? null;
    }

    public function setNameAttribute(?string $value): void
    {
        $this->attributes['nom'] = $value;
    }

    public function getPasswordAttribute(): ?string
    {
        return $this->attributes['motDePasse'] ?? null;
    }

    public function setPasswordAttribute(?string $value): void
    {
        $this->attributes['motDePasse'] = $value;
    }

    public function pregnancies(): HasMany
    {
        return $this->hasMany(Pregnancy::class);
    }

    public function menopauses(): HasMany
    {
        return $this->hasMany(Menopause::class);
    }

    public function appNotifications(): HasMany
    {
        return $this->hasMany(AppNotification::class, 'user_id');
    }
}

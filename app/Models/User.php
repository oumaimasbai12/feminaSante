<?php

namespace App\Models;

use App\Models\Menopause\Menopause;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Cycle;
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
        'is_gynecologist',
    ];

    /**
     * Explicitly guard virtual attributes so they are never
     * written to the database by Sanctum / Notifiable internals.
     */
    protected $guarded = ['name', 'password'];

    protected $hidden = [
        'motDePasse',
        'remember_token',
    ];

    protected $appends = [
        'age',
        'menopause_eligible',
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
            'is_gynecologist' => 'boolean',
            'is_admin' => 'boolean',
        ];
    }

    /**
     * Laravel / Sanctum traits call $user->name internally.
     * Map it to the real 'nom' column without persisting 'name'.
     */
    public function getNameAttribute(): ?string
    {
        return $this->attributes['nom'] ?? null;
    }

    public function getAgeAttribute(): ?int
    {
        return $this->birth_date ? (int) $this->birth_date->age : null;
    }

    public function getMenopauseEligibleAttribute(): bool
    {
        if ($this->age === null) {
            return false;
        }

        return $this->age >= (int) config('menopause.min_tracking_age', 45);
    }

    public function setNameAttribute(?string $value): void
    {
        $this->attributes['nom'] = $value;
        unset($this->attributes['name']);
    }

    /**
     * Laravel auth calls getAuthPassword() to verify credentials.
     * Map it to our 'motDePasse' column.
     */
    public function getAuthPassword(): string
    {
        return $this->attributes['motDePasse'] ?? '';
    }

    public function getPasswordAttribute(): ?string
    {
        return $this->attributes['motDePasse'] ?? null;
    }

    public function setPasswordAttribute(?string $value): void
    {
        $this->attributes['motDePasse'] = $value;
        unset($this->attributes['password']);
    }

    public function cycles(): HasMany
    {
        return $this->hasMany(Cycle::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(\App\Models\Appointments\Appointment::class);
    }

    public function pregnancies(): HasMany
    {
        return $this->hasMany(Pregnancy::class);
    }

    public function menopauses(): HasMany
    {
        return $this->hasMany(Menopause::class);
    }

    public function gynecologistProfile(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(\App\Models\Appointments\Gynecologist::class, 'user_id');
    }

    public function appNotifications(): HasMany
    {
        return $this->hasMany(AppNotification::class, 'user_id');
    }
}
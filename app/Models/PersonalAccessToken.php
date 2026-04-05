<?php

namespace App\Models;

use Laravel\Sanctum\PersonalAccessToken as SanctumPersonalAccessToken;

class PersonalAccessToken extends SanctumPersonalAccessToken
{
    protected $fillable = [
        'name',
        'nom',
        'token',
        'abilities',
        'expires_at',
    ];

    public function getNameAttribute(): ?string
    {
        return $this->attributes['nom'] ?? null;
    }

    public function setNameAttribute(?string $value): void
    {
        $this->attributes['nom'] = $value;
    }
}

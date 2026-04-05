<?php

namespace App\Models;

use App\Models\Diseases\DiseaseSymptom;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Symptom extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'category',
        'icon',
        'descriptions',
    ];

    public const UPDATED_AT = null;

    public function getDescriptionAttribute(): ?string
    {
        return $this->attributes['descriptions'] ?? null;
    }

    public function setDescriptionAttribute(?string $value): void
    {
        $this->attributes['descriptions'] = $value;
    }

    public function cycles(): BelongsToMany
    {
        return $this->belongsToMany(Cycle::class, 'cycle_symptom')
            ->withPivot(['severity', 'notes'])
            ->withTimestamps();
    }

    public function diseaseSymptoms(): HasMany
    {
        return $this->hasMany(DiseaseSymptom::class, 'symptom_nom', 'nom');
    }
}

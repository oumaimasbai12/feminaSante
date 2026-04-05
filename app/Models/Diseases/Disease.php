<?php

namespace App\Models\Diseases;

use Database\Factories\DiseaseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disease extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'scientific_nom',
        'slug',
        'category_id',
        'description',
        'common_symptoms',
        'causes',
        'risk_factors',
        'diagnosis_methods',
        'treatment_overview',
        'prevention_tips',
        'complications',
        'when_to_see_doctor',
        'specialistes',
        'is_chronic',
        'icd10_code',
        'resources',
        'disclaimer',
        'view_count',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'common_symptoms' => 'array',
            'risk_factors' => 'array',
            'diagnosis_methods' => 'array',
            'prevention_tips' => 'array',
            'specialistes' => 'array',
            'resources' => 'array',
            'is_chronic' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(DiseaseCategory::class, 'category_id');
    }

    public function symptoms(): HasMany
    {
        return $this->hasMany(DiseaseSymptom::class);
    }

    public function treatments(): HasMany
    {
        return $this->hasMany(DiseaseTreatment::class);
    }

    public function faqs(): HasMany
    {
        return $this->hasMany(DiseaseFaq::class);
    }

    public function resourceItems(): HasMany
    {
        return $this->hasMany(DiseaseResource::class);
    }

    protected static function newFactory(): Factory
    {
        return DiseaseFactory::new();
    }
}

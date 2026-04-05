<?php

namespace App\Models\Pregnancy;

use Database\Factories\PregnancyCheckupFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PregnancyCheckup extends Model
{
    use HasFactory;

    protected $fillable = [
        'pregnancy_id',
        'checkup_date',
        'week',
        'checkup_type',
        'doctor_name',
        'hospital_name',
        'weight',
        'blood_pressure_systolic',
        'blood_pressure_diastolic',
        'fundal_height',
        'fetal_heart_rate',
        'observations',
        'prescriptions',
        'next_appointement',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'checkup_date' => 'date',
            'next_appointement' => 'date',
            'observations' => 'array',
            'prescriptions' => 'array',
        ];
    }

    public function pregnancy(): BelongsTo
    {
        return $this->belongsTo(Pregnancy::class);
    }

    protected static function newFactory(): Factory
    {
        return PregnancyCheckupFactory::new();
    }
}

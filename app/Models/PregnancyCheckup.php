<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PregnancyCheckup extends Model
{
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
        'next_appointment',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'checkup_date' => 'date',
            'next_appointment' => 'date',
            'observations' => 'array',
            'prescriptions' => 'array',
        ];
    }

    public function pregnancy(): BelongsTo
    {
        return $this->belongsTo(Pregnancy::class);
    }
}

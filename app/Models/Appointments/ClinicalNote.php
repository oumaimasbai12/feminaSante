<?php

namespace App\Models\Appointments;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClinicalNote extends Model
{
    protected $fillable = [
        'user_id',
        'gynecologist_id',
        'appointment_id',
        'diagnostic',
        'prescription',
        'notes',
        'patient_summary',
        'shared_with_patient',
    ];

    protected function casts(): array
    {
        return [
            'shared_with_patient' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function gynecologist(): BelongsTo
    {
        return $this->belongsTo(Gynecologist::class);
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class);
    }
}

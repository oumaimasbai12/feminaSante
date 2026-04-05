<?php

namespace App\Models\Appointments;

use App\Models\User;
use Database\Factories\AppointmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Appointment extends Model
{
    use HasFactory;

    protected $table = 'appointements';

    public const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'gynecologist_id',
        'start_time',
        'end_time',
        'status',
        'consultation_type',
        'reason',
        'notes',
        'is_first_visit',
        'cancellation_reason',
        'rating',
        'review',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
            'is_first_visit' => 'boolean',
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

    protected static function newFactory(): Factory
    {
        return AppointmentFactory::new();
    }
}

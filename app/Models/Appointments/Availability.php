<?php

namespace App\Models\Appointments;

use Database\Factories\AvailabilityFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Availability extends Model
{
    use HasFactory;

    public const UPDATED_AT = null;

    protected $fillable = [
        'gynecologist_id',
        'date',
        'start_time',
        'end_time',
        'is_available',
        'recurrence',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_available' => 'boolean',
        ];
    }

    public function gynecologist(): BelongsTo
    {
        return $this->belongsTo(Gynecologist::class);
    }

    protected static function newFactory(): Factory
    {
        return AvailabilityFactory::new();
    }
}

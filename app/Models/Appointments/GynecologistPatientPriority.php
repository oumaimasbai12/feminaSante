<?php

namespace App\Models\Appointments;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GynecologistPatientPriority extends Model
{
    protected $fillable = [
        'gynecologist_id',
        'user_id',
        'priority',
    ];

    public function gynecologist(): BelongsTo
    {
        return $this->belongsTo(Gynecologist::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}

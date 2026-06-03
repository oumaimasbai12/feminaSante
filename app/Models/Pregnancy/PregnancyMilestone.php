<?php

namespace App\Models\Pregnancy;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PregnancyMilestone extends Model
{
    protected $fillable = [
        'pregnancy_id',
        'week',
        'title',
        'description',
        'checkup_type',
        'scheduled_date',
        'status',
        'reminder_sent_at',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'reminder_sent_at' => 'datetime',
        ];
    }

    public function pregnancy(): BelongsTo
    {
        return $this->belongsTo(Pregnancy::class);
    }
}

<?php

namespace App\Models;

use App\Services\CycleService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Carbon\Carbon;

class Cycle extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'start_date',
        'end_date',
        'phase',
        'flow_intensity',
        'mood',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function symptoms(): BelongsToMany
    {
        return $this->belongsToMany(Symptom::class, 'cycle_symptom')
            ->withPivot(['severity', 'notes'])
            ->withTimestamps();
    }

    /**
     * Get the duration of the period in days.
     */
    public function getPeriodDurationAttribute(): int
    {
        return $this->start_date->diffInDays($this->end_date) + 1;
    }

    /**
     * Get the current cycle day relative to this cycle.
     */
    public function getCurrentCycleDayAttribute(): int
    {
        $service = app(CycleService::class);
        return $service->getCurrentCycleDay($this);
    }
}

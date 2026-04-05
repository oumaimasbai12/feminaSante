<?php

namespace App\Models\Menopause;

use App\Enums\Menopause\MenopauseTreatmentTypeEnum;
use App\Enums\Menopause\MenopauseTreatmentStatusEnum;
use Database\Factories\MenopauseTreatmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenopauseTreatment extends Model
{
    use HasFactory;

    protected $fillable = [
        'menopause_id',
        'treatment_type',
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'relieves_hot_flashes',
        'relieves_sleep_changes',
        'relieves_mood_changes',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'treatment_type' => MenopauseTreatmentTypeEnum::class,
            'status' => MenopauseTreatmentStatusEnum::class,
            'relieves_hot_flashes' => 'boolean',
            'relieves_sleep_changes' => 'boolean',
            'relieves_mood_changes' => 'boolean',
        ];
    }

    public function menopause(): BelongsTo
    {
        return $this->belongsTo(Menopause::class);
    }

    protected static function newFactory(): Factory
    {
        return MenopauseTreatmentFactory::new();
    }
}

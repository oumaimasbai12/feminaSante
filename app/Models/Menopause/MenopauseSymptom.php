<?php

namespace App\Models\Menopause;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MenopauseSymptom extends Model
{
    protected $fillable = [
        'slug',
        'name_fr',
        'category',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function symptomLogs(): BelongsToMany
    {
        return $this->belongsToMany(
            MenopauseSymptomLog::class,
            'menopause_symptom_log_symptom',
            'menopause_symptom_id',
            'menopause_symptom_log_id'
        )->withPivot('intensity')->withTimestamps();
    }
}

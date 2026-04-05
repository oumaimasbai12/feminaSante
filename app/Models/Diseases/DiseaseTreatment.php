<?php

namespace App\Models\Diseases;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiseaseTreatment extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'disease_id',
        'treatment_type',
        'description',
        'is_common',
    ];

    protected function casts(): array
    {
        return [
            'is_common' => 'boolean',
        ];
    }

    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class);
    }
}

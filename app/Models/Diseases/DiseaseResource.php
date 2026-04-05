<?php

namespace App\Models\Diseases;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiseaseResource extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'disease_id',
        'resource_type',
        'title',
        'description',
    ];

    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class);
    }
}

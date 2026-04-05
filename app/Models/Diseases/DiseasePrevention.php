<?php

namespace App\Models\Diseases;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiseasePrevention extends Model
{
    use HasFactory;

    protected $fillable = [
        'disease_id',
        'title',
        'description',
        'icon',
        'order',
    ];

    public function disease(): BelongsTo
    {
        return $this->belongsTo(Disease::class);
    }
}

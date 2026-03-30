<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Symptom extends Model
{
    protected $fillable = [
        'nom',
        'category',
        'icon',
        'description',
    ];

    public function cycles(): BelongsToMany
    {
        return $this->belongsToMany(Cycle::class, 'cycle_symptom')
            ->withPivot(['severity', 'notes'])
            ->withTimestamps();
    }
}

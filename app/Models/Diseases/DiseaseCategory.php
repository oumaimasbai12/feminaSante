<?php

namespace App\Models\Diseases;

use Database\Factories\DiseaseCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiseaseCategory extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'nom',
        'slug',
        'description',
        'icon',
        'color',
        'parent_id',
        'display_order',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id');
    }

    public function diseases(): HasMany
    {
        return $this->hasMany(Disease::class, 'category_id');
    }

    protected static function newFactory(): Factory
    {
        return DiseaseCategoryFactory::new();
    }
}

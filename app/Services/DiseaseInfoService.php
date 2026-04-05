<?php

namespace App\Services;

use App\Models\Diseases\Disease;
use App\Models\Diseases\DiseaseCategory;
use Illuminate\Database\Eloquent\Collection;

class DiseaseInfoService
{
    /**
     * Get a paginated catalog of all active diseases.
     */
    public function getCatalog($perPage = 15)
    {
        return Disease::with(['category', 'symptoms'])
            ->where('is_active', true)
            ->paginate($perPage);
    }

    /**
     * Get a specific disease with all its relations.
     */
    public function getDiseaseDetails(string $slug): ?Disease
    {
        return Disease::with([
            'category',
            'symptoms',
            'treatments',
            'resourceItems',
            'faqs',
        ])->where('slug', $slug)
          ->where('is_active', true)
          ->firstOrFail();
    }

    /**
     * Find potential diseases matching a list of symptom tags.
     * This acts as the logic behind the symptom checker.
     */
    public function matchSymptoms(array $symptomNames): Collection
    {
        if (empty($symptomNames)) {
            return collect();
        }

        // Educational disclaimer: this is a simple matching query, not a diagnostic engine.
        return Disease::whereHas('symptoms', function ($query) use ($symptomNames) {
            $query->whereIn('symptom_nom', $symptomNames);
        })
        ->where('is_active', true)
        ->with('symptoms')
        ->take(10)
        ->get();
    }
    
    /**
     * Retrieve general prevention tips (if we implement a global table or fetch from diseases).
     */
    public function getGlobalPreventionTips($perPage = 10)
    {
        // If a separate DiseasePrevention model is used globally:
        if (class_exists(\App\Models\Diseases\DiseasePrevention::class)) {
            return \App\Models\Diseases\DiseasePrevention::paginate($perPage);
        }
        
        // Otherwise extract from existing diseases JSON
        return Disease::whereNotNull('prevention_tips')
            ->where('is_active', true)
            ->select('nom', 'slug', 'prevention_tips', 'category_id')
            ->with('category')
            ->paginate($perPage);
    }

    /**
     * Increment the view count for a disease in the catalog.
     */
    public function recordView(Disease $disease): void
    {
        $disease->increment('view_count');
    }
}

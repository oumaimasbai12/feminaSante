<?php

namespace Database\Factories;

use App\Models\Diseases\Disease;
use App\Models\Diseases\DiseaseCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DiseaseFactory extends Factory
{
    protected $model = Disease::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'nom' => Str::title($name),
            'scientific_nom' => Str::title($name) . ' scientifica',
            'slug' => Str::slug($name) . '-' . fake()->unique()->numberBetween(1000, 9999),
            'category_id' => DiseaseCategory::factory(),
            'description' => fake()->paragraph(),
            'common_symptoms' => [fake()->word(), fake()->word()],
            'causes' => fake()->paragraph(),
            'risk_factors' => [fake()->word()],
            'diagnosis_methods' => [fake()->sentence()],
            'treatment_overview' => fake()->paragraph(),
            'prevention_tips' => [fake()->sentence()],
            'complications' => fake()->paragraph(),
            'when_to_see_doctor' => fake()->paragraph(),
            'specialistes' => [fake()->jobTitle()],
            'is_chronic' => false,
            'icd10_code' => 'N39.0',
            'resources' => [fake()->url()],
            'disclaimer' => '⚠️ Ces informations sont éducatives et ne remplacent pas un avis médical professionnel.',
            'view_count' => 0,
            'is_active' => true,
        ];
    }
}

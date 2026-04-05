<?php

namespace Database\Factories;

use App\Models\Pregnancy\Pregnancy;
use App\Models\Pregnancy\PregnancyCheckup;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PregnancyCheckup>
 */
class PregnancyCheckupFactory extends Factory
{
    protected $model = PregnancyCheckup::class;

    public function definition(): array
    {
        return [
            'pregnancy_id' => Pregnancy::factory(),
            'checkup_date' => fake()->date(),
            'week' => fake()->numberBetween(1, 42),
            'checkup_type' => fake()->randomElement([
                'first_trimester', 'second_trimester', 'third_trimester',
                'ultrasound', 'blood_test', 'urine_test',
                'glucose_test', 'emergency', 'routine',
            ]),
            'doctor_name' => fake()->name(),
            'hospital_name' => fake()->company(),
            'weight' => fake()->randomFloat(2, 50, 120),
            'blood_pressure_systolic' => fake()->numberBetween(90, 140),
            'blood_pressure_diastolic' => fake()->numberBetween(60, 90),
            'fundal_height' => fake()->randomFloat(1, 10, 40),
            'fetal_heart_rate' => fake()->numberBetween(110, 160) . ' bpm',
            'observations' => null,
            'prescriptions' => null,
            'next_appointement' => fake()->dateTimeBetween('+1 week', '+4 weeks')->format('Y-m-d'),
            'notes' => null,
        ];
    }
}

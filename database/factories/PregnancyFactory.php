<?php

namespace Database\Factories;

use App\Models\Pregnancy\Pregnancy;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pregnancy>
 */
class PregnancyFactory extends Factory
{
    protected $model = Pregnancy::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('-8 months', 'now');
        $dueDate = (clone $startDate)->modify('+9 months');

        return [
            'user_id' => User::factory(),
            'start_date' => $startDate->format('Y-m-d'),
            'due_date' => $dueDate->format('Y-m-d'),
            'conception_date' => (clone $startDate)->modify('-2 weeks')->format('Y-m-d'),
            'pregnancy_type' => fake()->randomElement(['simple', 'twins', 'triplets', 'multiples']),
            'statuts' => 'ongoing',
            'high_risk' => false,
            'risk_factors' => null,
            'blood_type' => fake()->randomElement(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            'rhesus_negative' => false,
            'allergies' => null,
            'medical_conditions' => null,
            'notes' => null,
        ];
    }

    public function highRisk(): static
    {
        return $this->state(fn () => [
            'high_risk' => true,
            'risk_factors' => 'Hypertension, diabetes gestationnel',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'statuts' => 'completed',
        ]);
    }

    public function twins(): static
    {
        return $this->state(fn () => [
            'pregnancy_type' => 'twins',
        ]);
    }
}

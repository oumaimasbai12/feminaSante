<?php

namespace Database\Factories;

use App\Models\Appointments\Gynecologist;
use Illuminate\Database\Eloquent\Factories\Factory;

class GynecologistFactory extends Factory
{
    protected $model = Gynecologist::class;

    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'speciality' => 'gynecologie',
            'license_number' => fake()->unique()->numerify('LIC-#####'),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'adress' => fake()->address(),
            'city' => fake()->city(),
            'postal_code' => fake()->postcode(),
            'consultation_type' => ['cabinet', 'teleconsultation'],
            'consultation_duration' => 30,
            'consultation_fee' => 300.00,
            'bio' => fake()->paragraph(),
            'languages_spoken' => ['Français', 'Arabe'],
            'rating' => 0,
            'review_count' => 0,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}

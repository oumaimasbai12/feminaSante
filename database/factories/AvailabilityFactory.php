<?php

namespace Database\Factories;

use App\Models\Appointments\Availability;
use App\Models\Appointments\Gynecologist;
use Illuminate\Database\Eloquent\Factories\Factory;

class AvailabilityFactory extends Factory
{
    protected $model = Availability::class;

    public function definition(): array
    {
        return [
            'gynecologist_id' => Gynecologist::factory(),
            'date' => fake()->dateTimeBetween('+1 day', '+1 month')->format('Y-m-d'),
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
            'is_available' => true,
            'recurrence' => 'none',
        ];
    }

    public function unavailable(): static
    {
        return $this->state(fn () => ['is_available' => false]);
    }
}

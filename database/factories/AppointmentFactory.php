<?php

namespace Database\Factories;

use App\Models\Appointments\Appointment;
use App\Models\Appointments\Gynecologist;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('+1 day', '+1 month');
        $endTime = (clone $startTime)->modify('+30 minutes');

        return [
            'user_id' => User::factory(),
            'gynecologist_id' => Gynecologist::factory(),
            'start_time' => $startTime->format('Y-m-d H:i:s'),
            'end_time' => $endTime->format('Y-m-d H:i:s'),
            'status' => 'pending',
            'consultation_type' => 'cabinet',
            'reason' => 'Consultation de routine',
            'notes' => null,
            'is_first_visit' => false,
            'cancellation_reason' => null,
            'rating' => null,
            'review' => null,
        ];
    }
}

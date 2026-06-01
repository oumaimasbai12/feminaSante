<?php

namespace Database\Seeders;

use App\Models\Appointments\Appointment;
use App\Models\Appointments\Gynecologist;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('is_gynecologist', false)->get();
        $gynecologists = Gynecologist::all();

        if ($users->isEmpty() || $gynecologists->isEmpty()) {
            $this->command->info('Please seed users and gynecologists first!');
            return;
        }

        $reasons = [
            'Consultation annuelle',
            'Suivi de grossesse',
            'Douleurs pelviennes',
            'Préscription de contraception',
            'Symptômes de la ménopause',
            'Examen de routine'
        ];

        foreach ($users as $user) {
            foreach ($gynecologists as $gyn) {
                // Create 2-3 appointments per user-gynecologist pair
                for ($i = 0; $i < rand(2, 3); $i++) {
                    $startTime = Carbon::now()->addDays(rand(1, 14))->setTime(rand(9, 17), rand(0, 30));
                    $endTime = $startTime->copy()->addMinutes(30);

                    Appointment::create([
                        'user_id' => $user->id,
                        'gynecologist_id' => $gyn->id,
                        'start_time' => $startTime,
                        'end_time' => $endTime,
                        'status' => ['pending', 'confirmed', 'completed'][rand(0, 2)],
                        'reason' => $reasons[array_rand($reasons)],
                        'notes' => $i % 2 === 0 ? null : 'Patient a mentionné des douleurs légères.',
                        'is_first_visit' => $i === 0
                    ]);
                }
            }
        }
    }
}
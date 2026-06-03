<?php

namespace Database\Seeders;

use App\Models\Appointments\Availability;
use App\Models\Appointments\Gynecologist;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class AvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        $start = Carbon::tomorrow();

        Gynecologist::query()->where('is_active', true)->each(function (Gynecologist $doctor) use ($start) {
            for ($day = 0; $day < 14; $day++) {
                $date = $start->copy()->addDays($day);

                if ($date->isWeekend()) {
                    continue;
                }

                Availability::firstOrCreate(
                    [
                        'gynecologist_id' => $doctor->id,
                        'date' => $date->toDateString(),
                        'start_time' => '09:00:00',
                        'end_time' => '17:00:00',
                    ],
                    [
                        'is_available' => true,
                        'recurrence' => 'none',
                    ]
                );
            }
        });

        $this->command->info('✅ Disponibilités générées (14 jours ouvrés, 9h–17h)');
    }
}

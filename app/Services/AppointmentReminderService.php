<?php

namespace App\Services;

use App\Models\Appointments\Appointment;
use App\Models\AppNotification;
use Carbon\Carbon;

class AppointmentReminderService
{
    public function sendDueReminders(): int
    {
        $count = 0;
        $count += $this->sendWindowReminders(24, 'reminder_24h_sent_at', 'demain');
        $count += $this->sendWindowReminders(2, 'reminder_2h_sent_at', 'dans 2 heures');

        return $count;
    }

    private function sendWindowReminders(int $hoursAhead, string $sentColumn, string $label): int
    {
        $from = Carbon::now()->addHours($hoursAhead - 1);
        $to = Carbon::now()->addHours($hoursAhead + 1);

        $appointments = Appointment::with(['user', 'gynecologist.user'])
            ->where('status', 'confirmed')
            ->whereNull($sentColumn)
            ->whereBetween('start_time', [$from, $to])
            ->get();

        $count = 0;

        foreach ($appointments as $appointment) {
            $doctor = $appointment->gynecologist;
            $patient = $appointment->user;
            if (! $doctor || ! $patient) {
                continue;
            }

            $when = $appointment->start_time->locale('fr')->isoFormat('dddd D MMMM [à] HH[h]mm');
            $doctorName = 'Dr. '.$doctor->first_name.' '.$doctor->last_name;

            AppNotification::create([
                'user_id' => $patient->id,
                'type' => 'appointment_reminder',
                'title' => "Rappel : RDV {$label}",
                'message' => "Votre rendez-vous avec {$doctorName} est prévu le {$when}.",
                'data' => [
                    'appointment_id' => $appointment->id,
                    'gynecologist_id' => $appointment->gynecologist_id,
                ],
            ]);

            if ($doctor->user_id) {
                AppNotification::create([
                    'user_id' => $doctor->user_id,
                    'type' => 'appointment_reminder',
                    'title' => "Rappel : consultation {$label}",
                    'message' => "Consultation avec {$patient->nom} le {$when}.",
                    'data' => ['appointment_id' => $appointment->id, 'patient_id' => $patient->id],
                ]);
            }

            $appointment->update([$sentColumn => now()]);
            $count++;
        }

        return $count;
    }
}

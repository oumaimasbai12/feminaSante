<?php

namespace App\Listeners;

use App\Events\AppointmentRequested;
use App\Models\AppNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendBookingNotification implements ShouldQueue
{
    public function handle(AppointmentRequested $event): void
    {
        $appointment = $event->appointment;
        $doctor = $appointment->gynecologist;
        $patient = $appointment->user;
        $when = $appointment->start_time->locale('fr')->isoFormat('dddd D MMMM YYYY [à] HH:mm');

        AppNotification::create([
            'user_id' => $patient->id,
            'type' => 'appointment',
            'title' => 'Demande de rendez-vous envoyée',
            'message' => "Votre demande avec Dr. {$doctor->first_name} {$doctor->last_name} le {$when} est en attente de confirmation.",
            'data' => [
                'appointment_id' => $appointment->id,
                'gynecologist_id' => $doctor->id,
                'status' => $appointment->status,
            ],
        ]);

        if ($doctor->user_id) {
            AppNotification::create([
                'user_id' => $doctor->user_id,
                'type' => 'appointment',
                'title' => 'Nouvelle demande de rendez-vous',
                'message' => "{$patient->nom} a demandé un rendez-vous le {$when}. Motif : ".($appointment->reason ?: 'Non précisé'),
                'data' => [
                    'appointment_id' => $appointment->id,
                    'patient_id' => $patient->id,
                    'status' => $appointment->status,
                ],
            ]);
        }
    }
}

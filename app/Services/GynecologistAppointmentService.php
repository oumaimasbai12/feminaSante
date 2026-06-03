<?php

namespace App\Services;

use App\Models\Appointments\Appointment;
use App\Models\Appointments\Gynecologist;
use App\Models\AppNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GynecologistAppointmentService
{
    private const TRANSITIONS = [
        'pending' => ['confirmed', 'cancelled'],
        'confirmed' => ['completed', 'cancelled'],
    ];

    public function transition(Gynecologist $gynecologist, Appointment $appointment, string $newStatus, ?string $reason = null): array
    {
        $this->assertOwnership($gynecologist, $appointment);

        $current = $appointment->status;
        $allowed = self::TRANSITIONS[$current] ?? [];

        if (! in_array($newStatus, $allowed, true)) {
            throw ValidationException::withMessages([
                'status' => ["Transition impossible : {$current} → {$newStatus}."],
            ]);
        }

        return DB::transaction(function () use ($appointment, $newStatus, $reason, $gynecologist) {
            $payload = ['status' => $newStatus];

            if ($newStatus === 'cancelled' && $reason) {
                $payload['cancellation_reason'] = $reason;
            }

            $appointment->update($payload);
            $appointment->refresh();
            $this->notifyPatient($appointment, $newStatus, $gynecologist);

            $response = [
                'message' => match ($newStatus) {
                    'confirmed' => 'Rendez-vous confirmé.',
                    'cancelled' => 'Rendez-vous refusé.',
                    'completed' => 'Consultation terminée.',
                    default => 'Statut mis à jour.',
                },
                'appointment' => $appointment->fresh()->load('user'),
                'requires_clinical_note' => $newStatus === 'completed',
            ];

            return $response;
        });
    }

    public function assertOwnership(Gynecologist $gynecologist, Appointment $appointment): void
    {
        if ($appointment->gynecologist_id !== $gynecologist->id) {
            throw ValidationException::withMessages([
                'appointment' => ['Ce rendez-vous ne vous appartient pas.'],
            ]);
        }
    }

    public function isVideoCallAvailable(Appointment $appointment): bool
    {
        $type = $appointment->consultation_type;
        $isOnline = in_array($type, ['online', 'teleconsultation', 'video'], true);

        if (! $isOnline || ! in_array($appointment->status, ['confirmed', 'pending'], true)) {
            return false;
        }

        $now = Carbon::now();
        $start = $appointment->start_time->copy()->subMinutes(10);
        $end = $appointment->end_time->copy()->addMinutes(15);

        return $now->between($start, $end);
    }

    private function notifyPatient(Appointment $appointment, string $newStatus, Gynecologist $gynecologist): void
    {
        $appointment->loadMissing('user');
        if (! $appointment->user_id) {
            return;
        }

        $doctorName = 'Dr. '.$gynecologist->first_name.' '.$gynecologist->last_name;
        $date = $appointment->start_time->locale('fr')->isoFormat('dddd D MMMM [à] HH[h]mm');
        $reason = $appointment->cancellation_reason;

        [$type, $title, $message] = match ($newStatus) {
            'confirmed' => ['appointment_confirmed', 'Rendez-vous confirmé', "Votre RDV avec {$doctorName} le {$date} est confirmé."],
            'cancelled' => [
                'appointment_cancelled',
                'Rendez-vous refusé',
                "Votre demande avec {$doctorName} le {$date} a été refusée."
                    .($reason ? " Motif : {$reason}" : '')
                    .' Vous pouvez choisir un autre créneau.',
            ],
            'completed' => [
                'appointment_completed',
                'Consultation terminée',
                "Votre consultation avec {$doctorName} est terminée. Votre compte-rendu sera disponible si le médecin le partage.",
            ],
            default => [null, null, null],
        };

        if (! $type) {
            return;
        }

        AppNotification::create([
            'user_id' => $appointment->user_id,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => [
                'appointment_id' => $appointment->id,
                'gynecologist_id' => $appointment->gynecologist_id,
                'status' => $newStatus,
                'cancellation_reason' => $appointment->cancellation_reason,
            ],
        ]);
    }

    public function notifyFollowUp(Appointment $appointment, Gynecologist $gynecologist, int $weeks): void
    {
        $appointment->loadMissing('user');
        if (! $appointment->user_id) {
            return;
        }

        $doctorName = 'Dr. '.$gynecologist->first_name.' '.$gynecologist->last_name;

        AppNotification::create([
            'user_id' => $appointment->user_id,
            'type' => 'follow_up_suggested',
            'title' => 'Suivi recommandé',
            'message' => "{$doctorName} recommande un contrôle dans {$weeks} semaine".($weeks > 1 ? 's' : '').'.',
            'data' => [
                'gynecologist_id' => $gynecologist->id,
                'appointment_id' => $appointment->id,
                'follow_up_weeks' => $weeks,
            ],
        ]);
    }
}

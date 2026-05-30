<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Appointment;
use App\Models\AppNotification;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function updateStatus(Request $request, Appointment $appointment)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled,completed',
        ]);

        $user = $request->user();
        if (!$user->gynecologistProfile || $appointment->gynecologist_id !== $user->gynecologistProfile->id) {
            return response()->json(['message' => 'Non autorisé. Ce rendez-vous ne vous appartient pas.'], 403);
        }

        $oldStatus = $appointment->status;
        $appointment->status = $request->status;
        $appointment->save();

        // ── Envoie une notification à la patiente ─────────────────────────────
        $this->notifyPatient($appointment, $request->status, $user->gynecologistProfile);

        return response()->json([
            'message' => 'Statut du rendez-vous mis à jour avec succès.',
            'appointment' => $appointment,
        ]);
    }

    public function updateNotes(Request $request, Appointment $appointment)
    {
        $request->validate([
            'notes' => 'required|string',
        ]);

        $user = $request->user();
        if (!$user->gynecologistProfile || $appointment->gynecologist_id !== $user->gynecologistProfile->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $appointment->notes = $request->notes;
        $appointment->save();

        return response()->json([
            'message' => 'Notes mises à jour avec succès.',
            'appointment' => $appointment,
        ]);
    }

    // ── Crée la notification dans la table notifications ──────────────────────
    private function notifyPatient(Appointment $appointment, string $newStatus, $gynecologist): void
    {
        // Charge la patiente si pas déjà chargée
        $appointment->loadMissing('user');
        $patientId = $appointment->user_id;

        if (!$patientId)
            return;

        $doctorName = 'Dr. ' . $gynecologist->first_name . ' ' . $gynecologist->last_name;
        $date = \Carbon\Carbon::parse($appointment->start_time)
            ->locale('fr')
            ->isoFormat('dddd D MMMM [à] HH[h]mm');

        [$type, $title, $message] = match ($newStatus) {
            'confirmed' => [
                'appointment_confirmed',
                '✅ Rendez-vous confirmé',
                "Votre rendez-vous avec {$doctorName} le {$date} a été confirmé.",
            ],
            'cancelled' => [
                'appointment_cancelled',
                '❌ Rendez-vous annulé',
                "Votre rendez-vous avec {$doctorName} le {$date} a été annulé. Vous pouvez reprendre un nouveau rendez-vous.",
            ],
            'completed' => [
                'appointment_completed',
                '🏁 Consultation terminée',
                "Votre consultation avec {$doctorName} est marquée comme terminée. Merci de votre confiance.",
            ],
            default => null,
        };

        if (!$type)
            return;

        AppNotification::create([
            'user_id' => $patientId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'data' => [
                'appointment_id' => $appointment->id,
                'gynecologist' => $doctorName,
                'date' => $appointment->start_time,
                'status' => $newStatus,
            ],
        ]);
    }
}
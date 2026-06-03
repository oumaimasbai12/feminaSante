<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Models\Appointments\ClinicalNote;
use App\Models\AppNotification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ClinicalNoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;

        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $notes = ClinicalNote::where('gynecologist_id', $gynecologist->id)
            ->where('user_id', $data['user_id'])
            ->latest()
            ->get();

        return response()->json($notes);
    }

    public function store(Request $request): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;

        $data = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'appointment_id' => ['nullable', 'exists:appointements,id'],
            'diagnostic' => ['nullable', 'string'],
            'prescription' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'patient_summary' => ['nullable', 'string', 'max:5000'],
        ]);

        if (! filled($data['diagnostic'] ?? null)
            && ! filled($data['prescription'] ?? null)
            && ! filled($data['notes'] ?? null)
            && ! filled($data['patient_summary'] ?? null)) {
            throw ValidationException::withMessages([
                'diagnostic' => ['Renseignez au moins un champ avant d\'enregistrer.'],
            ]);
        }

        if ($data['appointment_id'] ?? null) {
            $appointment = $gynecologist->appointments()->findOrFail($data['appointment_id']);
            $data['user_id'] = $appointment->user_id;
        }

        app(\App\Services\GynecologistPatientService::class)
            ->assertCanAccessPatient($gynecologist, (int) $data['user_id']);

        $shareWithPatient = filled($data['patient_summary'] ?? null);

        $note = ClinicalNote::create([
            ...$data,
            'gynecologist_id' => $gynecologist->id,
            'shared_with_patient' => $shareWithPatient,
        ]);

        if ($shareWithPatient) {
            $this->notifyPatientSummary($note, $gynecologist);
        }

        return response()->json([
            'message' => $shareWithPatient
                ? 'Note enregistrée et compte-rendu partagé avec la patiente.'
                : 'Note clinique enregistrée.',
            'clinical_note' => $note,
        ], 201);
    }

    private function notifyPatientSummary(ClinicalNote $note, $gynecologist): void
    {
        AppNotification::create([
            'user_id' => $note->user_id,
            'type' => 'visit_summary',
            'title' => 'Compte-rendu de consultation',
            'message' => 'Dr. '.$gynecologist->first_name.' '.$gynecologist->last_name.' a partagé un compte-rendu de votre consultation.',
            'data' => [
                'clinical_note_id' => $note->id,
                'appointment_id' => $note->appointment_id,
                'gynecologist_id' => $gynecologist->id,
            ],
        ]);
    }
}

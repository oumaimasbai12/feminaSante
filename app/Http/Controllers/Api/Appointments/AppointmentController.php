<?php

namespace App\Http\Controllers\Api\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Appointment;
use App\Models\Appointments\ClinicalNote;
use App\Events\AppointmentRequested;
use App\Services\AppointmentBookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly AppointmentBookingService $bookingService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $appointments = Appointment::with('gynecologist')
            ->where('user_id', $request->user()->id)
            ->latest('start_time')
            ->get();

        $summaries = ClinicalNote::query()
            ->whereIn('appointment_id', $appointments->pluck('id'))
            ->whereNotNull('patient_summary')
            ->get()
            ->keyBy(fn (ClinicalNote $note) => (int) $note->appointment_id);

        $result = $appointments->map(function (Appointment $appointment) use ($summaries) {
            $summary = $summaries->get((int) $appointment->id);

            return array_merge($appointment->toArray(), [
                'visit_summary' => $summary ? [
                    'id' => $summary->id,
                    'patient_summary' => $summary->patient_summary,
                    'prescription' => $summary->prescription,
                    'created_at' => $summary->created_at,
                ] : null,
            ]);
        });

        return response()->json($result);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'gynecologist_id' => ['required', 'exists:gynecologists,id'],
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'consultation_type' => ['nullable', 'string', 'max:50'],
            'reason' => ['nullable', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:2000'],
            'is_first_visit' => ['nullable', 'boolean'],
        ]);

        $appointment = $this->bookingService->book($request->user(), $data);

        AppointmentRequested::dispatch($appointment);

        return response()->json([
            'message' => 'Demande de rendez-vous envoyée. En attente de confirmation du médecin.',
            'appointment' => $appointment->load('gynecologist'),
        ], 201);
    }

    public function show(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($appointment->load('gynecologist'));
    }

    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'status' => ['nullable', 'in:pending,confirmed,cancelled,completed'],
            'cancellation_reason' => ['nullable', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'review' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $appointment->update($data);

        return response()->json([
            'message' => 'Appointment updated successfully.',
            'appointment' => $appointment,
        ]);
    }

    public function updatePreparation(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (! in_array($appointment->status, ['pending', 'confirmed'], true)) {
            throw ValidationException::withMessages([
                'patient_preparation' => ['Ce rendez-vous ne peut plus être modifié.'],
            ]);
        }

        if ($appointment->start_time->isPast()) {
            throw ValidationException::withMessages([
                'patient_preparation' => ['Ce rendez-vous est déjà passé.'],
            ]);
        }

        $data = $request->validate([
            'patient_preparation' => ['required', 'string', 'max:2000'],
        ]);

        $appointment->update(['patient_preparation' => $data['patient_preparation']]);

        return response()->json([
            'message' => 'Préparation enregistrée.',
            'appointment' => $appointment,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Appointment;
use App\Models\User;
use App\Services\GynecologistAppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly GynecologistAppointmentService $appointmentService
    ) {
    }

    public function confirm(Request $request, Appointment $appointment): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;
        $result = $this->appointmentService->transition($gynecologist, $appointment, 'confirmed');

        return response()->json($result);
    }

    public function refuse(Request $request, Appointment $appointment): JsonResponse
    {
        $data = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $gynecologist = $request->user()->gynecologistProfile;
        $result = $this->appointmentService->transition(
            $gynecologist,
            $appointment,
            'cancelled',
            $data['reason'] ?? 'Refusé par le praticien'
        );

        return response()->json($result);
    }

    public function complete(Request $request, Appointment $appointment): JsonResponse
    {
        $data = $request->validate([
            'follow_up_weeks' => ['nullable', 'integer', 'min:1', 'max:52'],
        ]);

        $gynecologist = $request->user()->gynecologistProfile;
        $result = $this->appointmentService->transition($gynecologist, $appointment, 'completed');

        if (! empty($data['follow_up_weeks'])) {
            $appointment->refresh()->update(['follow_up_weeks' => $data['follow_up_weeks']]);
            $this->appointmentService->notifyFollowUp($appointment, $gynecologist, (int) $data['follow_up_weeks']);
        }

        return response()->json($result);
    }

    public function updateStatus(Request $request, Appointment $appointment): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:confirmed,cancelled,completed'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $gynecologist = $request->user()->gynecologistProfile;
        $result = $this->appointmentService->transition(
            $gynecologist,
            $appointment,
            $data['status'],
            $data['reason'] ?? null
        );

        return response()->json($result);
    }

    public function updateNotes(Request $request, Appointment $appointment): JsonResponse
    {
        $data = $request->validate([
            'notes' => ['required', 'string'],
        ]);

        $gynecologist = $request->user()->gynecologistProfile;
        $this->appointmentService->assertOwnership($gynecologist, $appointment);

        $appointment->update(['notes' => $data['notes']]);

        return response()->json([
            'message' => 'Notes mises à jour.',
            'appointment' => $appointment,
        ]);
    }
}

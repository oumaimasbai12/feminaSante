<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Appointment;
use App\Models\Appointments\GynecologistPatientPriority;
use App\Services\GynecologistAppointmentService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request, GynecologistAppointmentService $appointmentService): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;

        $priorities = GynecologistPatientPriority::where('gynecologist_id', $gynecologist->id)
            ->pluck('priority', 'user_id');

        $appointments = Appointment::with('user')
            ->where('gynecologist_id', $gynecologist->id)
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(function ($apt) use ($priorities, $appointmentService) {
                return [
                    'id' => $apt->id,
                    'user_id' => $apt->user_id,
                    'patient_name' => $apt->user->nom ?? 'Inconnu',
                    'patient_email' => $apt->user->email ?? '',
                    'start_time' => $apt->start_time,
                    'end_time' => $apt->end_time,
                    'status' => $apt->status,
                    'reason' => $apt->reason,
                    'notes' => $apt->notes,
                    'patient_preparation' => $apt->patient_preparation,
                    'consultation_type' => $apt->consultation_type,
                    'is_first_visit' => $apt->is_first_visit ?? false,
                    'priority' => $priorities[$apt->user_id] ?? 'routine',
                    'video_call_available' => $appointmentService->isVideoCallAvailable($apt),
                ];
            })
            ->sortBy([
                fn ($a) => match ($a['priority']) {
                    'emergency' => 0,
                    'follow_up' => 1,
                    default => 2,
                },
                ['start_time', 'asc'],
            ])
            ->values();

        return response()->json([
            'gynecologist_name' => $gynecologist->first_name.' '.$gynecologist->last_name,
            'profile' => [
                'speciality' => $gynecologist->speciality,
                'city' => $gynecologist->city,
                'consultation_duration' => $gynecologist->consultation_duration,
                'consultation_fee' => $gynecologist->consultation_fee,
            ],
            'stats' => [
                'total_appointments' => $appointments->count(),
                'pending_appointments' => $appointments->where('status', 'pending')->count(),
                'confirmed_appointments' => $appointments->where('status', 'confirmed')->count(),
                'completed_appointments' => $appointments->where('status', 'completed')->count(),
                'today_appointments' => $appointments->filter(fn ($a) => Carbon::parse($a['start_time'])->isToday())->count(),
                'emergency_patients' => $appointments->where('priority', 'emergency')->unique('user_id')->count(),
            ],
            'appointments' => $appointments,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;

        $appointments = Appointment::with('user')
            ->where('gynecologist_id', $gynecologist->id)
            ->orderBy('start_time', 'asc')
            ->get()
            ->map(fn($apt) => [
                'id'             => $apt->id,
                'patient_name'   => $apt->user->nom ?? 'Inconnu',
                'patient_email'  => $apt->user->email ?? 'N/A',
                'start_time'     => $apt->start_time,
                'end_time'       => $apt->end_time,
                'status'         => $apt->status,
                'reason'         => $apt->reason,
                'notes'          => $apt->notes,
                'is_first_visit' => $apt->is_first_visit ?? false,
            ]);

        return response()->json([
            'gynecologist_name' => $gynecologist->first_name . ' ' . $gynecologist->last_name,
            'stats' => [
                'total_appointments'     => $appointments->count(),
                'pending_appointments'   => $appointments->where('status', 'pending')->count(),
                'confirmed_appointments' => $appointments->where('status', 'confirmed')->count(),
                'completed_appointments' => $appointments->where('status', 'completed')->count(),
            ],
            'appointments' => $appointments->values(),
        ]);
    }
}

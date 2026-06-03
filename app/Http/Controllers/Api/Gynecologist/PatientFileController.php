<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\GynecologistAppointmentService;
use App\Services\GynecologistPatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientFileController extends Controller
{
    public function __invoke(
        Request $request,
        User $user,
        GynecologistPatientService $patientService,
        GynecologistAppointmentService $appointmentService
    ): JsonResponse {
        $gynecologist = $request->user()->gynecologistProfile;
        $file = $patientService->buildPatientFile($gynecologist, $user);

        $nextAppointment = $gynecologist->appointments()
            ->where('user_id', $user->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('start_time', '>=', now())
            ->orderBy('start_time')
            ->first();

        $file['video_call_available'] = $nextAppointment
            ? $appointmentService->isVideoCallAvailable($nextAppointment)
            : false;
        $file['next_appointment'] = $nextAppointment;

        return response()->json($file);
    }
}

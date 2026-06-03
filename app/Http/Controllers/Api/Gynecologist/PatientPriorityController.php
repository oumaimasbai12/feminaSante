<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Models\Appointments\GynecologistPatientPriority;
use App\Models\User;
use App\Services\GynecologistPatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientPriorityController extends Controller
{
    public function update(Request $request, User $user, GynecologistPatientService $patientService): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;
        $patientService->assertCanAccessPatient($gynecologist, $user->id);

        $data = $request->validate([
            'priority' => ['required', 'in:emergency,routine,follow_up'],
        ]);

        $record = GynecologistPatientPriority::updateOrCreate(
            [
                'gynecologist_id' => $gynecologist->id,
                'user_id' => $user->id,
            ],
            ['priority' => $data['priority']]
        );

        return response()->json([
            'message' => 'Priorité mise à jour.',
            'priority' => $record,
        ]);
    }
}

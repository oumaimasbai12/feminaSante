<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Services\GynecologistPatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientListController extends Controller
{
    public function __invoke(Request $request, GynecologistPatientService $patientService): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;

        return response()->json($patientService->listPatients($gynecologist));
    }
}

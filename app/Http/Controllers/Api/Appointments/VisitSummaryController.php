<?php

namespace App\Http\Controllers\Api\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Appointments\ClinicalNote;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitSummaryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notes = ClinicalNote::query()
            ->with(['gynecologist:id,first_name,last_name,speciality', 'appointment:id,start_time,status'])
            ->where('user_id', $request->user()->id)
            ->where('shared_with_patient', true)
            ->whereNotNull('patient_summary')
            ->latest()
            ->get()
            ->map(fn (ClinicalNote $note) => [
                'id' => $note->id,
                'appointment_id' => $note->appointment_id,
                'patient_summary' => $note->patient_summary,
                'prescription' => $note->prescription,
                'created_at' => $note->created_at,
                'gynecologist' => $note->gynecologist,
                'appointment' => $note->appointment,
            ]);

        return response()->json($notes);
    }
}

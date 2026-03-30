<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy;
use App\Models\PregnancyCheckup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PregnancyCheckupController extends Controller
{
    public function store(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'checkup_date' => ['required', 'date'],
            'week' => ['required', 'integer'],
            'checkup_type' => ['required', 'string'],
            'doctor_name' => ['nullable', 'string'],
            'hospital_name' => ['nullable', 'string'],
            'weight' => ['nullable', 'numeric'],
            'blood_pressure_systolic' => ['nullable', 'integer'],
            'blood_pressure_diastolic' => ['nullable', 'integer'],
            'fundal_height' => ['nullable', 'numeric'],
            'fetal_heart_rate' => ['nullable', 'string'],
            'observations' => ['nullable', 'array'],
            'prescriptions' => ['nullable', 'array'],
            'next_appointment' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ]);

        $checkup = PregnancyCheckup::create([
            ...$data,
            'pregnancy_id' => $pregnancy->id,
        ]);

        return response()->json([
            'message' => 'Checkup created successfully.',
            'checkup' => $checkup,
        ], 201);
    }
}

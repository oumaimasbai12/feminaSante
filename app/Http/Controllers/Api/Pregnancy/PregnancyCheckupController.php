<?php

namespace App\Http\Controllers\Api\Pregnancy;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Pregnancy\PregnancyCheckup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PregnancyCheckupController extends Controller
{
    public function index(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $pregnancy->checkups()->latest('checkup_date')->get()
        );
    }

    public function store(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $checkup = PregnancyCheckup::create([
            ...$this->validateCheckup($request),
            'pregnancy_id' => $pregnancy->id,
        ]);

        return response()->json([
            'message' => 'Checkup created successfully.',
            'checkup' => $checkup,
        ], 201);
    }

    public function show(Request $request, PregnancyCheckup $pregnancyCheckup): JsonResponse
    {
        if ($pregnancyCheckup->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($pregnancyCheckup);
    }

    public function update(Request $request, PregnancyCheckup $pregnancyCheckup): JsonResponse
    {
        if ($pregnancyCheckup->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $pregnancyCheckup->update($this->validateCheckup($request, true));

        return response()->json([
            'message' => 'Checkup updated successfully.',
            'checkup' => $pregnancyCheckup->fresh(),
        ]);
    }

    public function destroy(Request $request, PregnancyCheckup $pregnancyCheckup): JsonResponse
    {
        if ($pregnancyCheckup->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $pregnancyCheckup->delete();

        return response()->json([
            'message' => 'Checkup deleted successfully.',
        ]);
    }

    private function validateCheckup(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'checkup_date' => [$required, 'date'],
            'week' => [$required, 'integer', 'min:1', 'max:45'],
            'checkup_type' => [$required, 'in:first_trimester,second_trimester,third_trimester,ultrasound,blood_test,urine_test,glucose_test,emergency,routine'],
            'doctor_name' => ['nullable', 'string', 'max:255'],
            'hospital_name' => ['nullable', 'string', 'max:255'],
            'weight' => ['nullable', 'numeric', 'between:20,250'],
            'blood_pressure_systolic' => [$required, 'integer', 'between:60,250'],
            'blood_pressure_diastolic' => [$required, 'integer', 'between:40,180'],
            'fundal_height' => ['nullable', 'numeric', 'between:1,70'],
            'fetal_heart_rate' => ['nullable', 'string', 'max:20'],
            'observations' => ['nullable', 'array'],
            'prescriptions' => ['nullable', 'array'],
            'next_appointement' => ['nullable', 'date', 'after_or_equal:checkup_date'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Pregnancy;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Pregnancy\PregnancySymptom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PregnancySymptomController extends Controller
{
    public function index(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $pregnancy->symptoms()->latest('recorded_at')->get()
        );
    }

    public function store(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $this->validateSymptom($request);

        $symptom = PregnancySymptom::create([
            ...$data,
            'pregnancy_id' => $pregnancy->id,
            'recorded_at' => $data['recorded_at'] ?? now(),
        ]);

        return response()->json([
            'message' => 'Pregnancy symptom logged successfully.',
            'symptom' => $symptom,
        ], 201);
    }

    public function show(Request $request, PregnancySymptom $pregnancySymptom): JsonResponse
    {
        if ($pregnancySymptom->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($pregnancySymptom);
    }

    public function update(Request $request, PregnancySymptom $pregnancySymptom): JsonResponse
    {
        if ($pregnancySymptom->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $pregnancySymptom->update($this->validateSymptom($request, true));

        return response()->json([
            'message' => 'Pregnancy symptom updated successfully.',
            'symptom' => $pregnancySymptom->fresh(),
        ]);
    }

    public function destroy(Request $request, PregnancySymptom $pregnancySymptom): JsonResponse
    {
        if ($pregnancySymptom->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $pregnancySymptom->delete();

        return response()->json([
            'message' => 'Pregnancy symptom deleted successfully.',
        ]);
    }

    private function validateSymptom(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'name' => [$required, 'string', 'max:100', Rule::in(config('pregnancy.symptoms', []))],
            'intensity' => [$required, 'in:faible,modéré,élevé,intense'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'recorded_at' => ['nullable', 'date'],
        ]);
    }
}

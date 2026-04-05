<?php

namespace App\Http\Controllers\Api\Pregnancy;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Pregnancy\WeightGain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeightGainController extends Controller
{
    public function index(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $pregnancy->weightGains()->latest('date')->get()
        );
    }

    public function store(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $weightGain = WeightGain::create([
            ...$this->validateWeightGain($request),
            'pregnancy_id' => $pregnancy->id,
        ]);

        return response()->json([
            'message' => 'Weight gain entry created successfully.',
            'weight_gain' => $weightGain,
        ], 201);
    }

    public function show(Request $request, WeightGain $weightGain): JsonResponse
    {
        if ($weightGain->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($weightGain);
    }

    public function update(Request $request, WeightGain $weightGain): JsonResponse
    {
        if ($weightGain->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $weightGain->update($this->validateWeightGain($request, true));

        return response()->json([
            'message' => 'Weight gain entry updated successfully.',
            'weight_gain' => $weightGain->fresh(),
        ]);
    }

    public function destroy(Request $request, WeightGain $weightGain): JsonResponse
    {
        if ($weightGain->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $weightGain->delete();

        return response()->json([
            'message' => 'Weight gain entry deleted successfully.',
        ]);
    }

    private function validateWeightGain(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'date' => [$required, 'date'],
            'week' => [$required, 'integer', 'min:1', 'max:45'],
            'weight' => [$required, 'numeric', 'between:20,250'],
            'bmi' => ['nullable', 'numeric', 'between:10,70'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}

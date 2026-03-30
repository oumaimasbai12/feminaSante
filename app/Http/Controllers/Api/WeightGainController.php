<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy;
use App\Models\WeightGain;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeightGainController extends Controller
{
    public function store(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'date' => ['required', 'date'],
            'week' => ['required', 'integer'],
            'weight' => ['required', 'numeric'],
            'bmi' => ['nullable', 'numeric'],
            'notes' => ['nullable', 'string'],
        ]);

        $weightGain = WeightGain::create([
            ...$data,
            'pregnancy_id' => $pregnancy->id,
        ]);

        return response()->json([
            'message' => 'Weight gain entry created successfully.',
            'weight_gain' => $weightGain,
        ], 201);
    }
}

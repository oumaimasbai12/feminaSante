<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contraction;
use App\Models\Pregnancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContractionController extends Controller
{
    public function store(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'start_time' => ['required', 'date'],
            'end_time' => ['nullable', 'date'],
            'duration_seconds' => ['required', 'integer'],
            'interval_seconds' => ['nullable', 'integer'],
            'intensity' => ['nullable', 'in:mild,moderate,strong,very strong'],
            'is_active' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);

        $contraction = Contraction::create([
            ...$data,
            'pregnancy_id' => $pregnancy->id,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Contraction created successfully.',
            'contraction' => $contraction,
        ], 201);
    }
}

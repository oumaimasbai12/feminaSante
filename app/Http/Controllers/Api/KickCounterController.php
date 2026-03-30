<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KickCounter;
use App\Models\Pregnancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KickCounterController extends Controller
{
    public function store(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['nullable'],
            'kicks_count' => ['nullable', 'integer'],
            'time_to_10_kicks' => ['nullable', 'string'],
            'activity_level' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $kickCounter = KickCounter::create([
            ...$data,
            'pregnancy_id' => $pregnancy->id,
            'kicks_count' => $data['kicks_count'] ?? 0,
        ]);

        return response()->json([
            'message' => 'Kick counter created successfully.',
            'kick_counter' => $kickCounter,
        ], 201);
    }
}

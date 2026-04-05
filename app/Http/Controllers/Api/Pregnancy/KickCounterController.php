<?php

namespace App\Http\Controllers\Api\Pregnancy;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy\KickCounter;
use App\Models\Pregnancy\Pregnancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class KickCounterController extends Controller
{
    public function index(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $pregnancy->kickCounters()->latest('date')->latest('start_time')->get()
        );
    }

    public function store(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $kickCounter = KickCounter::create([
            ...$this->validateKickCounter($request),
            'pregnancy_id' => $pregnancy->id,
            'kicks_count' => $request->integer('kicks_count', 0),
        ]);

        return response()->json([
            'message' => 'Kick counter created successfully.',
            'kick_counter' => $kickCounter,
        ], 201);
    }

    public function show(Request $request, KickCounter $kickCounter): JsonResponse
    {
        if ($kickCounter->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($kickCounter);
    }

    public function update(Request $request, KickCounter $kickCounter): JsonResponse
    {
        if ($kickCounter->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $kickCounter->update($this->validateKickCounter($request, true));

        return response()->json([
            'message' => 'Kick counter updated successfully.',
            'kick_counter' => $kickCounter->fresh(),
        ]);
    }

    public function destroy(Request $request, KickCounter $kickCounter): JsonResponse
    {
        if ($kickCounter->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $kickCounter->delete();

        return response()->json([
            'message' => 'Kick counter deleted successfully.',
        ]);
    }

    private function validateKickCounter(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'date' => [$required, 'date'],
            'start_time' => [$required, 'regex:/^\d{2}:\d{2}(:\d{2})?$/'],
            'end_time' => ['nullable', 'regex:/^\d{2}:\d{2}(:\d{2})?$/', 'after:start_time'],
            'kicks_count' => ['nullable', 'integer', 'min:0'],
            'time_to_10_kicks' => ['nullable', 'in:<30min,30-60min,1-2hours,>2hours'],
            'activity_level' => ['nullable', 'in:low,normal,high'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}

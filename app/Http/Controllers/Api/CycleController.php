<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CycleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cycles = Cycle::with('symptoms')
            ->where('user_id', $request->user()->id)
            ->latest('start_date')
            ->get();

        return response()->json($cycles);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

    if (! $user) {
        return response()->json([
            'message' => 'Unauthenticated.',
        ], 401);
    }
        $data = $request->validate([
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'phase' => ['nullable', 'in:menstruation,follicular,ovulation,luteal'],
            'flow_intensity' => ['nullable', 'in:light,medium,heavy'],
            'mood' => ['nullable', 'in:happy,sad,irritable,anxious,calm,other'],
            'notes' => ['nullable', 'string'],
            'symptom_ids' => ['nullable', 'array'],
            'symptom_ids.*' => ['exists:symptoms,id'],
        ]);

        $cycle = Cycle::create([
            'user_id' => $request->user()->id,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'phase' => $data['phase'] ?? 'menstruation',
            'flow_intensity' => $data['flow_intensity'] ?? null,
            'mood' => $data['mood'] ?? null,
            'notes' => $data['notes'] ?? null,
        ]);

        if (! empty($data['symptom_ids'])) {
            $cycle->symptoms()->sync($data['symptom_ids']);
        }

        return response()->json([
            'message' => 'Cycle created successfully.',
            'cycle' => $cycle->load('symptoms'),
        ], 201);
    }

    public function show(Request $request, Cycle $cycle): JsonResponse
    {
        if ($cycle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($cycle->load('symptoms'));
    }

    public function update(Request $request, Cycle $cycle): JsonResponse
    {
        if ($cycle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $request->validate([
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
            'phase' => ['sometimes', 'in:menstruation,follicular,ovulation,luteal'],
            'flow_intensity' => ['nullable', 'in:light,medium,heavy'],
            'mood' => ['nullable', 'in:happy,sad,irritable,anxious,calm,other'],
            'notes' => ['nullable', 'string'],
            'symptom_ids' => ['nullable', 'array'],
            'symptom_ids.*' => ['exists:symptoms,id'],
        ]);

        $cycle->update($data);

        if (array_key_exists('symptom_ids', $data)) {
            $cycle->symptoms()->sync($data['symptom_ids'] ?? []);
        }

        return response()->json([
            'message' => 'Cycle updated successfully.',
            'cycle' => $cycle->load('symptoms'),
        ]);
    }

    public function destroy(Request $request, Cycle $cycle): JsonResponse
    {
        if ($cycle->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $cycle->delete();

        return response()->json([
            'message' => 'Cycle deleted successfully.',
        ]);
    }
}

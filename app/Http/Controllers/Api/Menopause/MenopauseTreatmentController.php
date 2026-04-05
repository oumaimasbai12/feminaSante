<?php

namespace App\Http\Controllers\Api\Menopause;

use App\Http\Controllers\Controller;
use App\Models\Menopause\Menopause;
use App\Models\Menopause\MenopauseTreatment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenopauseTreatmentController extends Controller
{
    public function index(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $menopause->treatments()->latest('start_date')->latest()->get()
        );
    }

    public function store(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $treatment = MenopauseTreatment::create([
            ...$this->validateTreatment($request),
            'menopause_id' => $menopause->id,
            'status' => $request->input('status', 'active'),
            'relieves_hot_flashes' => $request->boolean('relieves_hot_flashes'),
            'relieves_sleep_changes' => $request->boolean('relieves_sleep_changes'),
            'relieves_mood_changes' => $request->boolean('relieves_mood_changes'),
        ]);

        return response()->json([
            'message' => 'Menopause treatment created successfully.',
            'treatment' => $treatment,
        ], 201);
    }

    public function show(Request $request, MenopauseTreatment $menopauseTreatment): JsonResponse
    {
        if ($menopauseTreatment->menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($menopauseTreatment);
    }

    public function update(Request $request, MenopauseTreatment $menopauseTreatment): JsonResponse
    {
        if ($menopauseTreatment->menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $this->validateTreatment($request, true);

        foreach (['relieves_hot_flashes', 'relieves_sleep_changes', 'relieves_mood_changes'] as $field) {
            if ($request->has($field)) {
                $data[$field] = $request->boolean($field);
            }
        }

        $menopauseTreatment->update($data);

        return response()->json([
            'message' => 'Menopause treatment updated successfully.',
            'treatment' => $menopauseTreatment->fresh(),
        ]);
    }

    public function destroy(Request $request, MenopauseTreatment $menopauseTreatment): JsonResponse
    {
        if ($menopauseTreatment->menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $menopauseTreatment->delete();

        return response()->json([
            'message' => 'Menopause treatment deleted successfully.',
        ]);
    }

    private function validateTreatment(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'treatment_type' => [$required, 'in:medication,therapy,lifestyle,supplement,alternative,monitoring'],
            'name' => [$required, 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['nullable', 'in:planned,active,completed,stopped'],
            'relieves_hot_flashes' => ['nullable', 'boolean'],
            'relieves_sleep_changes' => ['nullable', 'boolean'],
            'relieves_mood_changes' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}

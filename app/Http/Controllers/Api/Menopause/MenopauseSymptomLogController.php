<?php

namespace App\Http\Controllers\Api\Menopause;

use App\Http\Controllers\Controller;
use App\Models\Menopause\Menopause;
use App\Models\Menopause\MenopauseSymptomLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenopauseSymptomLogController extends Controller
{
    public function index(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $menopause->symptomLogs()->latest('log_date')->get()
        );
    }

    public function store(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $log = MenopauseSymptomLog::create([
            ...$this->validateLog($request),
            'menopause_id' => $menopause->id,
            'severity' => $request->input('severity', 'moderate'),
            'hot_flashes' => $request->boolean('hot_flashes'),
            'night_sweats' => $request->boolean('night_sweats'),
            'mood_changes' => $request->boolean('mood_changes'),
            'sleep_changes' => $request->boolean('sleep_changes'),
        ]);

        return response()->json([
            'message' => 'Menopause symptom log created successfully.',
            'log' => $log,
        ], 201);
    }

    public function show(Request $request, MenopauseSymptomLog $menopauseSymptomLog): JsonResponse
    {
        if ($menopauseSymptomLog->menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($menopauseSymptomLog);
    }

    public function update(Request $request, MenopauseSymptomLog $menopauseSymptomLog): JsonResponse
    {
        if ($menopauseSymptomLog->menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $this->validateLog($request, true);

        foreach (['hot_flashes', 'night_sweats', 'mood_changes', 'sleep_changes'] as $field) {
            if ($request->has($field)) {
                $data[$field] = $request->boolean($field);
            }
        }

        $menopauseSymptomLog->update($data);

        return response()->json([
            'message' => 'Menopause symptom log updated successfully.',
            'log' => $menopauseSymptomLog->fresh(),
        ]);
    }

    public function destroy(Request $request, MenopauseSymptomLog $menopauseSymptomLog): JsonResponse
    {
        if ($menopauseSymptomLog->menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $menopauseSymptomLog->delete();

        return response()->json([
            'message' => 'Menopause symptom log deleted successfully.',
        ]);
    }

    private function validateLog(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'log_date' => [$required, 'date'],
            'symptoms' => ['nullable', 'array'],
            'symptoms.*' => ['string', 'max:255'],
            'severity' => ['nullable', 'in:mild,moderate,severe'],
            'sleep_quality' => ['nullable', 'integer', 'between:1,10'],
            'mood_score' => ['nullable', 'integer', 'between:1,10'],
            'hot_flashes' => ['nullable', 'boolean'],
            'night_sweats' => ['nullable', 'boolean'],
            'mood_changes' => ['nullable', 'boolean'],
            'sleep_changes' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}

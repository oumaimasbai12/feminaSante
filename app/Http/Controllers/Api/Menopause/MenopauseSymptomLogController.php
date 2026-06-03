<?php

namespace App\Http\Controllers\Api\Menopause;

use App\Http\Controllers\Controller;
use App\Models\Menopause\Menopause;
use App\Models\Menopause\MenopauseSymptomLog;
use App\Services\MenopauseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenopauseSymptomLogController extends Controller
{
    public function __construct(private readonly MenopauseService $menopauseService)
    {
    }

    public function index(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $menopause->symptomLogs()->with('catalogSymptoms')->latest('log_date')->get()
        );
    }

    public function store(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $this->validateLog($request);
        $catalogSymptoms = $request->input('catalog_symptoms', []);

        $log = MenopauseSymptomLog::create([
            ...$data,
            'menopause_id' => $menopause->id,
            'severity' => $request->input('severity', 'moderate'),
            'hot_flashes' => $request->boolean('hot_flashes'),
            'night_sweats' => $request->boolean('night_sweats'),
            'mood_changes' => $request->boolean('mood_changes'),
            'sleep_changes' => $request->boolean('sleep_changes'),
        ]);

        if (! empty($catalogSymptoms)) {
            $this->menopauseService->syncLogSymptoms($log, $catalogSymptoms);
        }

        return response()->json([
            'message' => 'Menopause symptom log created successfully.',
            'log' => $log->load('catalogSymptoms'),
        ], 201);
    }

    public function show(Request $request, MenopauseSymptomLog $menopauseSymptomLog): JsonResponse
    {
        if ($menopauseSymptomLog->menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($menopauseSymptomLog->load('catalogSymptoms'));
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

        if ($request->has('catalog_symptoms')) {
            $this->menopauseService->syncLogSymptoms(
                $menopauseSymptomLog,
                $request->input('catalog_symptoms', [])
            );
        }

        return response()->json([
            'message' => 'Menopause symptom log updated successfully.',
            'log' => $menopauseSymptomLog->fresh()->load('catalogSymptoms'),
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
            'catalog_symptoms' => ['nullable', 'array'],
            'catalog_symptoms.*.symptom_id' => ['nullable', 'integer', 'exists:menopause_symptoms,id'],
            'catalog_symptoms.*.id' => ['nullable', 'integer', 'exists:menopause_symptoms,id'],
            'catalog_symptoms.*.intensity' => ['nullable', 'integer', 'between:1,3'],
            'severity' => ['nullable', 'in:mild,moderate,severe'],
            'sleep_quality' => ['nullable', 'integer', 'between:1,10'],
            'mood_score' => ['nullable', 'integer', 'between:1,10'],
            'hot_flashes' => ['nullable', 'boolean'],
            'night_sweats' => ['nullable', 'boolean'],
            'mood_changes' => ['nullable', 'boolean'],
            'sleep_changes' => ['nullable', 'boolean'],
            'stress_level' => ['nullable', 'integer', 'between:1,10'],
            'caffeine_cups' => ['nullable', 'integer', 'between:0,20'],
            'exercise_minutes' => ['nullable', 'integer', 'between:0,600'],
            'alcohol_units' => ['nullable', 'integer', 'between:0,20'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}

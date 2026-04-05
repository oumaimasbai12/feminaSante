<?php

namespace App\Http\Controllers\Api\Menopause;

use App\Http\Controllers\Controller;
use App\Models\Menopause\Menopause;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenopauseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Menopause::where('user_id', $request->user()->id)
                ->orderByRaw("CASE WHEN status = 'ongoing' THEN 0 ELSE 1 END")
                ->latest('diagnosis_date')
                ->latest()
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $this->validateMenopause($request);

        if (($data['status'] ?? 'ongoing') === 'ongoing' && $user->menopauses()->where('status', 'ongoing')->exists()) {
            return response()->json([
                'message' => 'You already have an ongoing menopause record.',
            ], 422);
        }

        $menopause = Menopause::create([
            ...$data,
            'user_id' => $user->id,
            'stage' => $data['stage'] ?? 'perimenopause',
            'status' => $data['status'] ?? 'ongoing',
            'cycle_irregularity' => $data['cycle_irregularity'] ?? false,
            'hot_flashes' => $data['hot_flashes'] ?? false,
            'night_sweats' => $data['night_sweats'] ?? false,
            'mood_changes' => $data['mood_changes'] ?? false,
            'sleep_changes' => $data['sleep_changes'] ?? false,
            'hormone_therapy' => $data['hormone_therapy'] ?? false,
        ]);

        return response()->json([
            'message' => 'Menopause record created successfully.',
            'menopause' => $menopause,
        ], 201);
    }

    public function show(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $menopause->load([
                'symptomLogs' => fn ($query) => $query->latest('log_date'),
                'treatments' => fn ($query) => $query->latest('start_date'),
            ])
        );
    }

    public function update(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $this->validateMenopause($request, true);

        if (($data['status'] ?? null) === 'ongoing') {
            $hasAnotherOngoingRecord = $request->user()
                ->menopauses()
                ->where('status', 'ongoing')
                ->whereKeyNot($menopause->id)
                ->exists();

            if ($hasAnotherOngoingRecord) {
                return response()->json([
                    'message' => 'You already have another ongoing menopause record.',
                ], 422);
            }
        }

        $menopause->update($data);

        return response()->json([
            'message' => 'Menopause record updated successfully.',
            'menopause' => $menopause->fresh(),
        ]);
    }

    public function destroy(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $menopause->delete();

        return response()->json([
            'message' => 'Menopause record deleted successfully.',
        ]);
    }

    private function validateMenopause(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'nullable';

        return $request->validate([
            'last_period_date' => [$required, 'date'],
            'diagnosis_date' => ['nullable', 'date'],
            'stage' => ['nullable', 'in:perimenopause,menopause,postmenopause'],
            'status' => ['nullable', 'in:ongoing,completed'],
            'symptoms' => ['nullable', 'array'],
            'symptoms.*' => ['string', 'max:255'],
            'cycle_irregularity' => ['nullable', 'boolean'],
            'hot_flashes' => ['nullable', 'boolean'],
            'night_sweats' => ['nullable', 'boolean'],
            'mood_changes' => ['nullable', 'boolean'],
            'sleep_changes' => ['nullable', 'boolean'],
            'hormone_therapy' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}

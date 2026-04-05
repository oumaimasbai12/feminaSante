<?php

namespace App\Http\Controllers\Api\Pregnancy;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy\Pregnancy;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PregnancyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Pregnancy::withCount(['checkups', 'kickCounters', 'contractions', 'weightGains'])
                ->where('user_id', $request->user()->id)
                ->orderByRaw("CASE WHEN statuts = 'ongoing' THEN 0 ELSE 1 END")
                ->latest('start_date')
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = $this->validatePregnancy($request);

        if (($data['statuts'] ?? 'ongoing') === 'ongoing' && $user->pregnancies()->where('statuts', 'ongoing')->exists()) {
            return response()->json([
                'message' => 'You already have an ongoing pregnancy.',
            ], 422);
        }

        $pregnancy = Pregnancy::create([
            ...$data,
            'user_id' => $user->id,
            'due_date' => $data['due_date'] ?? Carbon::parse($data['start_date'])->addDays(280)->toDateString(),
            'pregnancy_type' => $data['pregnancy_type'] ?? 'simple',
            'statuts' => $data['statuts'] ?? 'ongoing',
            'high_risk' => $data['high_risk'] ?? false,
            'rhesus_negative' => $data['rhesus_negative'] ?? false,
        ]);

        return response()->json([
            'message' => 'Pregnancy created successfully.',
            'pregnancy' => $pregnancy->loadCount(['checkups', 'kickCounters', 'contractions', 'weightGains']),
        ], 201);
    }

    public function show(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $pregnancy->load([
                'checkups' => fn ($query) => $query->latest('checkup_date'),
                'kickCounters' => fn ($query) => $query->latest('date'),
                'contractions' => fn ($query) => $query->latest('start_time'),
                'weightGains' => fn ($query) => $query->latest('date'),
            ])->loadCount(['checkups', 'kickCounters', 'contractions', 'weightGains'])
        );
    }

    public function update(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $this->validatePregnancy($request, true);

        if (($data['statuts'] ?? null) === 'ongoing') {
            $hasAnotherOngoingPregnancy = $request->user()
                ->pregnancies()
                ->where('statuts', 'ongoing')
                ->whereKeyNot($pregnancy->id)
                ->exists();

            if ($hasAnotherOngoingPregnancy) {
                return response()->json([
                    'message' => 'You already have another ongoing pregnancy.',
                ], 422);
            }
        }

        if (array_key_exists('start_date', $data) && ! array_key_exists('due_date', $data) && ! $pregnancy->due_date) {
            $data['due_date'] = Carbon::parse($data['start_date'])->addDays(280)->toDateString();
        }

        $pregnancy->update($data);

        return response()->json([
            'message' => 'Pregnancy updated successfully.',
            'pregnancy' => $pregnancy->fresh()->loadCount(['checkups', 'kickCounters', 'contractions', 'weightGains']),
        ]);
    }

    public function destroy(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $pregnancy->delete();

        return response()->json([
            'message' => 'Pregnancy deleted successfully.',
        ]);
    }

    private function validatePregnancy(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'start_date' => [$required, 'date'],
            'due_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'conception_date' => ['nullable', 'date', 'before_or_equal:due_date'],
            'pregnancy_type' => ['nullable', 'in:simple,twins,triplets,multiples'],
            'statuts' => ['nullable', 'in:ongoing,completed,miscarriage,terminated'],
            'high_risk' => ['nullable', 'boolean'],
            'risk_factors' => ['nullable', 'string'],
            'blood_type' => ['nullable', 'string', 'max:5'],
            'rhesus_negative' => ['nullable', 'boolean'],
            'allergies' => ['nullable', 'array'],
            'medical_conditions' => ['nullable', 'array'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}

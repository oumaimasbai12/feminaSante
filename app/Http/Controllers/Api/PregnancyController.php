<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PregnancyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Pregnancy::where('user_id', $request->user()->id)
                ->latest()
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'start_date' => ['required', 'date'],
            'due_date' => ['nullable', 'date'],
            'conception_date' => ['nullable', 'date'],
            'pregnancy_type' => ['nullable', 'in:simple,twins,triplets,multiples'],
            'status' => ['nullable', 'in:ongoing,completed,miscarriage,terminated'],
            'high_risk' => ['nullable', 'boolean'],
            'risk_factors' => ['nullable', 'string'],
            'blood_type' => ['nullable', 'string', 'max:5'],
            'rhesus_negative' => ['nullable', 'boolean'],
            'allergies' => ['nullable', 'array'],
            'medical_conditions' => ['nullable', 'array'],
            'notes' => ['nullable', 'string'],
        ]);

        $pregnancy = Pregnancy::create([
            ...$data,
            'user_id' => $user->id,
            'pregnancy_type' => $data['pregnancy_type'] ?? 'simple',
            'status' => $data['status'] ?? 'ongoing',
            'high_risk' => $data['high_risk'] ?? false,
            'rhesus_negative' => $data['rhesus_negative'] ?? false,
        ]);

        return response()->json([
            'message' => 'Pregnancy created successfully.',
            'pregnancy' => $pregnancy,
        ], 201);
    }

    public function show(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $pregnancy->load(['checkups', 'kickCounters', 'contractions', 'weightGains'])
        );
    }
}

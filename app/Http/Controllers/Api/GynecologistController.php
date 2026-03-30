<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gynecologist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GynecologistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Gynecologist::query()->where('is_active', true);

        if ($request->filled('city')) {
            $query->where('city', $request->string('city'));
        }

        return response()->json(
            $query->orderByDesc('rating')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'speciality' => ['nullable', 'string'],
            'license_number' => ['nullable', 'string', 'max:50', 'unique:gynecologists,license_number'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'consultation_type' => ['nullable', 'array'],
            'consultation_duration' => ['nullable', 'integer'],
            'consultation_fee' => ['nullable', 'numeric'],
            'bio' => ['nullable', 'string'],
            'languages_spoken' => ['nullable', 'array'],
        ]);

        $gynecologist = Gynecologist::create([
            ...$data,
            'consultation_duration' => $data['consultation_duration'] ?? 30,
            'rating' => 0,
            'review_count' => 0,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Gynecologist created successfully.',
            'gynecologist' => $gynecologist,
        ], 201);
    }

    public function show(Gynecologist $gynecologist): JsonResponse
    {
        return response()->json(
            $gynecologist->load('availabilities')
        );
    }
}

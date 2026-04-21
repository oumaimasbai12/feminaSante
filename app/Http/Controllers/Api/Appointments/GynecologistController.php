<?php

namespace App\Http\Controllers\Api\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Gynecologist;
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
            'adress' => ['required_without:address', 'string'],
            'address' => ['required_without:adress', 'string'],
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
            'adress' => $data['adress'] ?? $data['address'],
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

    public function update(Request $request, Gynecologist $gynecologist): JsonResponse
    {
        $data = $request->validate([
            'first_name' => ['sometimes', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'speciality' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email'],
            'adress' => ['nullable', 'string'],
            'city' => ['nullable', 'string', 'max:100'],
            'consultation_type' => ['nullable', 'array'],
            'consultation_duration' => ['nullable', 'integer'],
            'consultation_fee' => ['nullable', 'numeric'],
            'bio' => ['nullable', 'string'],
            'languages_spoken' => ['nullable', 'array'],
            'is_active' => ['nullable', 'boolean'],
        ]);
        $gynecologist->update($data);
        return response()->json(['message' => 'Mis à jour.', 'gynecologist' => $gynecologist]);
    }

    public function destroy(Gynecologist $gynecologist): JsonResponse
    {
        $gynecologist->update(['is_active' => false]);
        return response()->json(['message' => 'Gynécologue désactivée.']);
    }
}

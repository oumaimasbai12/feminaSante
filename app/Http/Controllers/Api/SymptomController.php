<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Symptom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SymptomController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Symptom::orderBy('nom')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:100'],
            'category' => ['required', 'in:physical,emotional,other'],
            'icon' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
        ]);

        $symptom = Symptom::create($data);

        return response()->json([
            'message' => 'Symptom created successfully.',
            'symptom' => $symptom,
        ], 201);
    }
}

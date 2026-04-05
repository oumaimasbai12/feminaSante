<?php

namespace App\Http\Controllers\Api\Pregnancy;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy\Contraction;
use App\Models\Pregnancy\Pregnancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContractionController extends Controller
{
    public function index(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json(
            $pregnancy->contractions()->latest('start_time')->get()
        );
    }

    public function store(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $contraction = Contraction::create([
            ...$this->validateContraction($request),
            'pregnancy_id' => $pregnancy->id,
            'is_active' => $request->boolean('is_active', false),
        ]);

        return response()->json([
            'message' => 'Contraction created successfully.',
            'contraction' => $contraction,
        ], 201);
    }

    public function show(Request $request, Contraction $contraction): JsonResponse
    {
        if ($contraction->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json($contraction);
    }

    public function update(Request $request, Contraction $contraction): JsonResponse
    {
        if ($contraction->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $data = $this->validateContraction($request, true);

        if ($request->has('is_active')) {
            $data['is_active'] = $request->boolean('is_active');
        }

        $contraction->update($data);

        return response()->json([
            'message' => 'Contraction updated successfully.',
            'contraction' => $contraction->fresh(),
        ]);
    }

    public function destroy(Request $request, Contraction $contraction): JsonResponse
    {
        if ($contraction->pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $contraction->delete();

        return response()->json([
            'message' => 'Contraction deleted successfully.',
        ]);
    }

    private function validateContraction(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'start_time' => [$required, 'date'],
            'end_time' => ['nullable', 'date', 'after_or_equal:start_time'],
            'duration_seconds' => [$required, 'integer', 'min:1'],
            'interval_seconds' => [$required, 'integer', 'min:1'],
            'intensity' => ['nullable', 'in:mild,moderate,strong,very strong'],
            'notes' => ['nullable', 'string'],
        ]);
    }
}

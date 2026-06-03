<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use App\Services\CycleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PredictionController extends Controller
{
    public function __construct(protected CycleService $cycleService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $cycles = Cycle::where('user_id', $request->user()->id)
            ->orderBy('start_date')
            ->get();

        if ($cycles->isEmpty()) {
            return response()->json([
                'message' => 'Not enough cycle data to generate predictions.',
                'predictions' => [],
            ]);
        }

        $predictions = $this->cycleService->getPredictions($cycles);

        return response()->json([
            'message' => 'Predictions generated successfully.',
            'predictions' => $predictions,
        ]);
    }
}

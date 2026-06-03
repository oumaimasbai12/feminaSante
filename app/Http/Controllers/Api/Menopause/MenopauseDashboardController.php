<?php

namespace App\Http\Controllers\Api\Menopause;

use App\Http\Controllers\Controller;
use App\Models\Menopause\Menopause;
use App\Services\MenopauseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenopauseDashboardController extends Controller
{
    public function __construct(private readonly MenopauseService $menopauseService)
    {
    }

    public function show(Request $request, Menopause $menopause): JsonResponse
    {
        if ($menopause->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json([
            'message' => 'Menopause dashboard loaded successfully.',
            'dashboard' => $this->menopauseService->getDashboard($menopause),
        ]);
    }

    public function symptomCatalog(): JsonResponse
    {
        return response()->json([
            'symptoms' => $this->menopauseService->getSymptomCatalog(),
        ]);
    }
}

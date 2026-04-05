<?php

namespace App\Http\Controllers\Api\Diseases;

use App\Http\Controllers\Controller;
use App\Services\DiseaseInfoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PreventionTipsController extends Controller
{
    public function __construct(private DiseaseInfoService $service) {}

    public function __invoke(Request $request): JsonResponse
    {
        $perPage = $request->query('per_page', 10);
        $tips = $this->service->getGlobalPreventionTips($perPage);

        return response()->json([
            'message' => 'Prevention tips retrieved successfully.',
            'data' => $tips
        ]);
    }
}

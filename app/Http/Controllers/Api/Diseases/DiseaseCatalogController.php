<?php

namespace App\Http\Controllers\Api\Diseases;

use App\Http\Controllers\Controller;
use App\Services\DiseaseInfoService;
use Illuminate\Http\JsonResponse;

class DiseaseCatalogController extends Controller
{
    public function __construct(private DiseaseInfoService $service) {}

    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Disease catalog retrieved successfully.',
            'data' => $this->service->getCatalog()
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $disease = $this->service->getDiseaseDetails($slug);
        $this->service->recordView($disease);

        return response()->json([
            'message' => 'Disease details retrieved successfully.',
            'data' => $disease
        ]);
    }
}

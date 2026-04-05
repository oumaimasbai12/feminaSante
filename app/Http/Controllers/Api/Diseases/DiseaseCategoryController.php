<?php

namespace App\Http\Controllers\Api\Diseases;

use App\Http\Controllers\Controller;
use App\Models\Diseases\DiseaseCategory;
use Illuminate\Http\JsonResponse;

class DiseaseCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = DiseaseCategory::orderBy('display_order')->get();

        return response()->json([
            'message' => 'Disease categories retrieved successfully.',
            'data' => $categories
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $category = DiseaseCategory::with(['diseases' => function ($q) {
            $q->where('is_active', true);
        }])->where('slug', $slug)->firstOrFail();

        return response()->json([
            'message' => 'Category details retrieved successfully.',
            'data' => $category
        ]);
    }
}

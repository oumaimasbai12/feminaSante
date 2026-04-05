<?php

namespace App\Http\Controllers\Api\Diseases;

use App\Http\Controllers\Controller;
use App\Services\DiseaseInfoService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SymptomCheckerController extends Controller
{
    public function __construct(private DiseaseInfoService $service) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'symptoms' => 'required|array',
            'symptoms.*' => 'string'
        ]);

        $matches = $this->service->matchSymptoms($request->input('symptoms'));

        return response()->json([
            'message' => 'Symptom matching complete. ⚠️ EDUCATIONAL TOOL ONLY.',
            'disclaimer' => 'These results are purely educational and do not replace professional medical diagnosis. Consult a doctor immediately in an emergency.',
            'data' => $matches
        ]);
    }
}

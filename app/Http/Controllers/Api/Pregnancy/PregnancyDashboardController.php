<?php

namespace App\Http\Controllers\Api\Pregnancy;

use App\Http\Controllers\Controller;
use App\Models\Pregnancy\Pregnancy;
use App\Services\PregnancyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class PregnancyDashboardController extends Controller
{
    public function __construct(private readonly PregnancyService $pregnancyService)
    {
    }

    public function show(Request $request, Pregnancy $pregnancy): JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        return response()->json([
            'message' => 'Pregnancy dashboard loaded successfully.',
            'dashboard' => $this->pregnancyService->getDashboard($pregnancy),
        ]);
    }

    public function export(Request $request, Pregnancy $pregnancy): Response|JsonResponse
    {
        if ($pregnancy->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $filename = 'femina-grossesse-'.$pregnancy->id.'.pdf';

        try {
            return $this->pregnancyService
                ->generateMedicalExportPdf($pregnancy)
                ->download($filename);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Impossible de générer le PDF. Assurez-vous que les migrations sont à jour (`php artisan migrate`), puis réessayez.',
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use App\Models\Cycle;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Menopause\Menopause;

class AdminDashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): JsonResponse
    {
        $stats = [
            'total_users' => User::count(),
            'total_cycles_logged' => Cycle::count(),
            'total_pregnancies' => Pregnancy::count(),
            'total_menopauses' => Menopause::count(),
        ];

        return response()->json([
            'message' => 'Dashboard statistics retrieved successfully.',
            'data' => $stats,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Gynecologist;
use App\Services\AppointmentBookingService;
use Illuminate\Http\JsonResponse;

class GynecologistAvailabilitySummaryController extends Controller
{
    public function __invoke(Gynecologist $gynecologist, AppointmentBookingService $bookingService): JsonResponse
    {
        if (! $gynecologist->is_active) {
            return response()->json(['message' => 'Gynecologist not available.'], 404);
        }

        $days = $bookingService->getUpcomingAvailability($gynecologist, 30);

        return response()->json([
            'gynecologist_id' => $gynecologist->id,
            'days' => $days,
            'has_availability' => $days->isNotEmpty(),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Gynecologist;
use App\Services\AppointmentBookingService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GynecologistSlotController extends Controller
{
    public function __invoke(Request $request, Gynecologist $gynecologist, AppointmentBookingService $bookingService): JsonResponse
    {
        if (! $gynecologist->is_active) {
            return response()->json(['message' => 'Gynecologist not available.'], 404);
        }

        $data = $request->validate([
            'date' => ['required', 'date', 'after_or_equal:today'],
        ]);

        $slots = $bookingService->getAvailableSlots(
            $gynecologist,
            Carbon::parse($data['date'])
        );

        return response()->json([
            'date' => $data['date'],
            'gynecologist_id' => $gynecologist->id,
            'slots' => $slots,
            'common_reasons' => config('appointments.common_reasons', []),
        ]);
    }
}

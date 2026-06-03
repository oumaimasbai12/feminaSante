<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Availability;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GynecologistAvailabilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;

        $slots = Availability::where('gynecologist_id', $gynecologist->id)
            ->whereDate('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->orderBy('start_time')
            ->get();

        return response()->json($slots);
    }

    public function store(Request $request): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;

        $data = $request->validate([
            'date' => ['required_without:dates', 'date', 'after_or_equal:today'],
            'dates' => ['sometimes', 'array', 'min:1'],
            'dates.*' => ['date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ]);

        $dates = array_values(array_unique($data['dates'] ?? [$data['date']]));
        $startTime = $data['start_time'].':00';
        $endTime = $data['end_time'].':00';

        $created = [];
        foreach ($dates as $date) {
            $created[] = Availability::firstOrCreate(
                [
                    'gynecologist_id' => $gynecologist->id,
                    'date' => $date,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                ],
                [
                    'is_available' => true,
                    'recurrence' => 'none',
                ]
            );
        }

        $gynecologist->syncActiveFromAvailabilities();
        $gynecologist->refresh();

        $count = count($created);

        return response()->json([
            'message' => $count > 1
                ? "{$count} créneaux ajoutés.".($gynecologist->is_active ? ' Votre profil est visible pour les patientes.' : '')
                : ($gynecologist->is_active
                    ? 'Créneau ajouté. Votre profil est visible pour les patientes.'
                    : 'Créneau ajouté au planning.'),
            'availabilities' => $created,
            'count' => $count,
            'is_active' => $gynecologist->is_active,
        ], 201);
    }

    public function destroy(Request $request, Availability $availability): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;

        if ($availability->gynecologist_id !== $gynecologist->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $availability->delete();

        $gynecologist->syncActiveFromAvailabilities();

        return response()->json([
            'message' => 'Créneau supprimé.',
            'is_active' => $gynecologist->fresh()->is_active,
        ]);
    }
}

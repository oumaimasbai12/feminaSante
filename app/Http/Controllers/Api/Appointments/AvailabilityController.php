<?php

namespace App\Http\Controllers\Api\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Availability;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Availability::with('gynecologist')->where('is_available', true);

        if ($request->filled('gynecologist_id')) {
            $query->where('gynecologist_id', $request->integer('gynecologist_id'));
        }

        if ($request->filled('date')) {
            $query->whereDate('date', $request->string('date'));
        }

        return response()->json(
            $query->orderBy('date')->orderBy('start_time')->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'gynecologist_id' => ['required', 'exists:gynecologists,id'],
            'date' => ['required', 'date'],
            'start_time' => ['required'],
            'end_time' => ['required'],
            'recurrence' => ['nullable', 'in:none,weekly,biweekly,monthly'],
        ]);

        $availability = Availability::create([
            ...$data,
            'is_available' => true,
            'recurrence' => $data['recurrence'] ?? 'none',
        ]);

        return response()->json([
            'message' => 'Availability created successfully.',
            'availability' => $availability,
        ], 201);
    }
}

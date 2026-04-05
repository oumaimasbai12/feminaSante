<?php

namespace App\Http\Controllers\Api\Appointments;

use App\Http\Controllers\Controller;
use App\Models\Appointments\Appointment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Appointment::with('gynecologist')
                ->where('user_id', $request->user()->id)
                ->latest('start_time')
                ->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $data = $request->validate([
            'gynecologist_id' => ['required', 'exists:gynecologists,id'],
            'start_time' => ['required', 'date'],
            'end_time' => ['required', 'date', 'after:start_time'],
            'consultation_type' => ['nullable', 'string', 'max:50'],
            'reason' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'is_first_visit' => ['nullable', 'boolean'],
        ]);

        $existingAppointment = Appointment::where('gynecologist_id', $data['gynecologist_id'])
            ->where('start_time', $data['start_time'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($existingAppointment) {
            return response()->json([
                'message' => 'This slot is already booked.',
            ], 422);
        }

        $appointment = Appointment::create([
            ...$data,
            'user_id' => $user->id,
            'status' => 'pending',
            'is_first_visit' => $data['is_first_visit'] ?? false,
        ]);

        return response()->json([
            'message' => 'Appointment booked successfully.',
            'appointment' => $appointment->load('gynecologist'),
        ], 201);
    }

    public function show(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        return response()->json(
            $appointment->load('gynecologist')
        );
    }

    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        $data = $request->validate([
            'status' => ['nullable', 'in:pending,confirmed,cancelled,completed'],
            'cancellation_reason' => ['nullable', 'string'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'review' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $appointment->update($data);

        return response()->json([
            'message' => 'Appointment updated successfully.',
            'appointment' => $appointment,
        ]);
    }
}

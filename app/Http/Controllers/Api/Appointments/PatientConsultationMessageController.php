<?php

namespace App\Http\Controllers\Api\Appointments;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\Appointments\Appointment;
use App\Models\Appointments\ConsultationMessage;
use App\Models\Appointments\Gynecologist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class PatientConsultationMessageController extends Controller
{
    public function index(Request $request, Gynecologist $gynecologist): JsonResponse
    {
        $this->assertCanMessage($request->user()->id, $gynecologist);

        ConsultationMessage::query()
            ->where('gynecologist_id', $gynecologist->id)
            ->where('user_id', $request->user()->id)
            ->where('sender_id', '!=', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = ConsultationMessage::with('sender:id,nom')
            ->where('gynecologist_id', $gynecologist->id)
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request, Gynecologist $gynecologist): JsonResponse
    {
        $user = $request->user();
        $this->assertCanMessage($user->id, $gynecologist);

        $data = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $message = ConsultationMessage::create([
            'gynecologist_id' => $gynecologist->id,
            'user_id' => $user->id,
            'sender_id' => $user->id,
            'body' => $data['body'],
        ]);

        if ($gynecologist->user_id) {
            AppNotification::create([
                'user_id' => $gynecologist->user_id,
                'type' => 'consultation_message',
                'title' => 'Message d\'une patiente',
                'message' => $user->nom.' : '.str($data['body'])->limit(120),
                'data' => [
                    'patient_id' => $user->id,
                    'gynecologist_id' => $gynecologist->id,
                    'message_id' => $message->id,
                ],
            ]);
        }

        return response()->json([
            'message' => 'Message envoyé.',
            'consultation_message' => $message->load('sender:id,nom'),
        ], 201);
    }

    private function assertCanMessage(int $userId, Gynecologist $gynecologist): void
    {
        $hasAcceptedAppointment = Appointment::query()
            ->where('user_id', $userId)
            ->where('gynecologist_id', $gynecologist->id)
            ->whereIn('status', config('appointments.patient_message_statuses', ['confirmed', 'completed']))
            ->exists();

        if (! $hasAcceptedAppointment) {
            throw ValidationException::withMessages([
                'gynecologist' => ['Vous pourrez échanger avec ce praticien une fois votre rendez-vous confirmé.'],
            ]);
        }
    }
}

<?php

namespace App\Http\Controllers\Api\Gynecologist;

use App\Http\Controllers\Controller;
use App\Models\AppNotification;
use App\Models\Appointments\ConsultationMessage;
use App\Models\User;
use App\Services\GynecologistPatientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConsultationMessageController extends Controller
{
    public function index(Request $request, User $user, GynecologistPatientService $patientService): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;
        $patientService->assertCanAccessPatient($gynecologist, $user->id);

        ConsultationMessage::query()
            ->where('gynecologist_id', $gynecologist->id)
            ->where('user_id', $user->id)
            ->where('sender_id', '!=', $request->user()->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = ConsultationMessage::with('sender:id,nom')
            ->where('gynecologist_id', $gynecologist->id)
            ->where('user_id', $user->id)
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request, User $user, GynecologistPatientService $patientService): JsonResponse
    {
        $gynecologist = $request->user()->gynecologistProfile;
        $patientService->assertCanAccessPatient($gynecologist, $user->id);

        $data = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $message = ConsultationMessage::create([
            'gynecologist_id' => $gynecologist->id,
            'user_id' => $user->id,
            'sender_id' => $request->user()->id,
            'body' => $data['body'],
        ]);

        AppNotification::create([
            'user_id' => $user->id,
            'type' => 'consultation_message',
            'title' => 'Message de votre gynécologue',
            'message' => 'Dr. '.$gynecologist->first_name.' '.$gynecologist->last_name.' : '.str($data['body'])->limit(120),
            'data' => [
                'gynecologist_id' => $gynecologist->id,
                'message_id' => $message->id,
            ],
        ]);

        return response()->json([
            'message' => 'Message envoyé.',
            'consultation_message' => $message->load('sender:id,nom'),
        ], 201);
    }
}

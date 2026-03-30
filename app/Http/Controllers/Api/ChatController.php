<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chat;
use App\Services\AIService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class ChatController extends Controller
{
    public function __construct(
        private readonly AIService $aiService
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Chat::where('user_id', $request->user()->id)
                ->latest()
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
            'message' => ['required', 'string'],
            'session_id' => ['nullable', 'string', 'max:100'],
            'context' => ['nullable', 'array'],
        ]);

        $sessionId = $data['session_id'] ?? Str::uuid()->toString();

        $aiResult = $this->aiService->generateHealthResponse(
            $data['message'],
            $data['context'] ?? []
        );

        $chat = Chat::create([
            'user_id' => $user->id,
            'session_id' => $sessionId,
            'message' => $data['message'],
            'response' => $aiResult['response'],
            'intent' => $aiResult['intent'],
            'sentiment' => $aiResult['sentiment'],
            'context' => $aiResult['context'],
            'completed_at' => Carbon::now(),
        ]);

        return response()->json([
            'message' => 'Chat response generated successfully.',
            'chat' => $chat,
        ], 201);
    }
}

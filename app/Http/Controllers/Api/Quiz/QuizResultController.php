<?php

namespace App\Http\Controllers\Api\Quiz;

use App\Http\Controllers\Controller;
use App\Models\Quiz\Quiz;
use App\Services\QuizService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizResultController extends Controller
{
    public function __construct(private readonly QuizService $quizService)
    {
    }

    public function store(Request $request, Quiz $quiz): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $data = $request->validate([
            'answers' => ['required', 'array'],
            'time_spent' => ['nullable', 'integer', 'min:0'],
        ]);

        $payload = $this->quizService->submitQuiz(
            $user,
            $quiz,
            $data['answers'],
            $data['time_spent'] ?? null
        );

        return response()->json([
            'message' => $payload['passed']
                ? 'Quiz passed successfully.'
                : 'Quiz completed. Keep learning!',
            ...$payload,
        ], 201, [], JSON_PRESERVE_ZERO_FRACTION);
    }
}

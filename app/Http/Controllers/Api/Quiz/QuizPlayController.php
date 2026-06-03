<?php

namespace App\Http\Controllers\Api\Quiz;

use App\Http\Controllers\Controller;
use App\Models\Quiz\Question;
use App\Models\Quiz\Quiz;
use App\Services\QuizService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuizPlayController extends Controller
{
    public function __construct(private readonly QuizService $quizService)
    {
    }

    public function play(Quiz $quiz): JsonResponse
    {
        return response()->json([
            'message' => 'Quiz loaded for play.',
            'quiz' => $this->quizService->getPlayPayload($quiz),
        ]);
    }

    public function checkAnswer(Request $request, Quiz $quiz, Question $question): JsonResponse
    {
        if ($question->quiz_id !== $quiz->id) {
            return response()->json(['message' => 'Question does not belong to this quiz.'], 404);
        }

        $data = $request->validate([
            'option_id' => ['required', 'integer', 'exists:question_options,id'],
        ]);

        return response()->json([
            'message' => 'Answer checked.',
            'feedback' => $this->quizService->checkAnswer($question, (int) $data['option_id']),
        ]);
    }
}

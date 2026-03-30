<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizResult;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class QuizResultController extends Controller
{
    public function store(Request $request, Quiz $quiz): JsonResponse
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $data = $request->validate([
            'answers' => ['required', 'array'],
            'time_spent' => ['nullable', 'integer'],
        ]);

        $quiz->load('questions.options');

        $score = 0;
        $totalPoints = $quiz->questions->sum('points');

        foreach ($quiz->questions as $question) {
            $submitted = $data['answers'][$question->id] ?? null;
            $correctOptionIds = $question->options
                ->where('is_correct', true)
                ->pluck('id')
                ->sort()
                ->values()
                ->all();

            $submittedIds = collect((array) $submitted)->map(fn ($id) => (int) $id)->sort()->values()->all();

            if ($submittedIds === $correctOptionIds) {
                $score += $question->points;
            }
        }

        $percentage = $totalPoints > 0 ? round(($score / $totalPoints) * 100, 2) : 0;

        $result = QuizResult::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'score' => $score,
            'total_points' => $totalPoints,
            'percentage' => $percentage,
            'answers' => $data['answers'],
            'time_spent' => $data['time_spent'] ?? null,
            'completed_at' => Carbon::now(),
        ]);

        $quiz->increment('attempt_count');
        $quiz->update([
            'average_score' => QuizResult::where('quiz_id', $quiz->id)->avg('percentage'),
        ]);

        return response()->json([
            'message' => 'Quiz submitted successfully.',
            'result' => $result,
        ], 201);
    }
}

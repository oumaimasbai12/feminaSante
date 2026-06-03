<?php

namespace App\Http\Controllers\Api\Quiz;

use App\Http\Controllers\Controller;
use App\Models\Quiz\Quiz;
use App\Services\QuizService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QuizController extends Controller
{
    public function __construct(private readonly QuizService $quizService)
    {
    }

    public function index(): JsonResponse
    {
        return response()->json($this->quizService->listQuizzes());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'category' => ['required', 'in:cycle,pregnancy,diseases,contraception,nutrition,general'],
            'difficulty' => ['nullable', 'in:beginner,intermediate,advanced'],
            'image_url' => ['nullable', 'string'],
            'time_limit' => ['nullable', 'integer'],
            'passing_score' => ['nullable', 'integer'],
        ]);

        $quiz = Quiz::create([
            ...$data,
            'slug' => Str::slug($data['title']).'-'.time(),
            'difficulty' => $data['difficulty'] ?? 'beginner',
            'passing_score' => $data['passing_score'] ?? 70,
            'time_limit' => $data['time_limit'] ?? 300,
            'attempt_count' => 0,
        ]);

        return response()->json([
            'message' => 'Quiz created successfully.',
            'quiz' => $quiz,
        ], 201);
    }

    /** Admin / debug — includes correct answers. Prefer GET /play for users. */
    public function show(Quiz $quiz): JsonResponse
    {
        return response()->json(
            $quiz->load(['questions' => fn ($q) => $q->orderBy('display_order'), 'questions.options'])
        );
    }
}

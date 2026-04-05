<?php

namespace App\Http\Controllers\Api\Quiz;

use App\Http\Controllers\Controller;
use App\Models\Quiz\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class QuizController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            Quiz::withCount('questions')->latest()->get()
        );
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
            'slug' => Str::slug($data['title']) . '-' . time(),
            'difficulty' => $data['difficulty'] ?? 'beginner',
            'passing_score' => $data['passing_score'] ?? 70,
            'attempt_count' => 0,
        ]);

        return response()->json([
            'message' => 'Quiz created successfully.',
            'quiz' => $quiz,
        ], 201);
    }

    public function show(Quiz $quiz): JsonResponse
    {
        return response()->json(
            $quiz->load('questions.options')
        );
    }
}

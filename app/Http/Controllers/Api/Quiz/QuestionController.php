<?php

namespace App\Http\Controllers\Api\Quiz;

use App\Http\Controllers\Controller;
use App\Models\Quiz\Question;
use App\Models\Quiz\Quiz;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function store(Request $request, Quiz $quiz): JsonResponse
    {
        $data = $request->validate([
            'question_text' => ['required', 'string'],
            'type' => ['nullable', 'in:single,multiple,true_false'],
            'points' => ['nullable', 'integer'],
            'display_order' => ['required', 'integer'],
            'explanation' => ['nullable', 'string'],
            'img_url' => ['nullable', 'string'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.option_text' => ['required', 'string'],
            'options.*.is_correct' => ['required', 'boolean'],
            'options.*.display_order' => ['required', 'integer'],
        ]);

        $question = Question::create([
            'quiz_id' => $quiz->id,
            'question_text' => $data['question_text'],
            'type' => $data['type'] ?? 'single',
            'points' => $data['points'] ?? 1,
            'display_order' => $data['display_order'],
            'explanation' => $data['explanation'] ?? null,
            'img_url' => $data['img_url'] ?? null,
        ]);

        foreach ($data['options'] as $option) {
            $question->options()->create($option);
        }

        return response()->json([
            'message' => 'Question created successfully.',
            'question' => $question->load('options'),
        ], 201);
    }
}

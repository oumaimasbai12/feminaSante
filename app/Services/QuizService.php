<?php

namespace App\Services;

use App\Models\Quiz\Question;
use App\Models\Quiz\Quiz;
use App\Models\Quiz\QuizResult;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class QuizService
{
    /**
     * Play payload — options without is_correct to prevent cheating client-side.
     */
    public function getPlayPayload(Quiz $quiz): array
    {
        $quiz->load([
            'questions' => fn ($q) => $q->orderBy('display_order')->with(['options' => fn ($o) => $o->orderBy('display_order')]),
        ]);

        return [
            'id' => $quiz->id,
            'title' => $quiz->title,
            'description' => $quiz->description,
            'category' => $quiz->category,
            'difficulty' => $quiz->difficulty,
            'time_limit' => $quiz->time_limit ?? 300,
            'passing_score' => $quiz->passing_score ?? 70,
            'questions_count' => $quiz->questions->count(),
            'questions' => $quiz->questions->map(fn (Question $question) => [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'type' => $question->type,
                'points' => $question->points,
                'display_order' => $question->display_order,
                'options' => $question->options->map(fn ($option) => [
                    'id' => $option->id,
                    'option_text' => $option->option_text,
                    'display_order' => $option->display_order,
                ])->values(),
            ])->values(),
        ];
    }

    /**
     * Immediate feedback for one answer (educational correction).
     */
    public function checkAnswer(Question $question, int $optionId): array
    {
        $question->load('options');
        $correctOption = $question->options->firstWhere('is_correct', true);
        $selectedOption = $question->options->firstWhere('id', $optionId);
        $isCorrect = $correctOption && $correctOption->id === $optionId;

        return [
            'is_correct' => $isCorrect,
            'explanation' => $question->explanation,
            'correct_option_text' => $isCorrect ? null : $correctOption?->option_text,
            'selected_option_text' => $selectedOption?->option_text,
        ];
    }

    /**
     * Score = (correct_points / total_points) * 100
     */
    public function calculateScore(Quiz $quiz, array $answers): array
    {
        $quiz->load('questions.options');

        $score = 0;
        $totalPoints = $quiz->questions->sum('points');
        $breakdown = [];

        foreach ($quiz->questions as $question) {
            $submitted = $answers[$question->id] ?? null;
            $correctOption = $question->options->firstWhere('is_correct', true);
            $isCorrect = $correctOption && (int) $submitted === $correctOption->id;

            if ($isCorrect) {
                $score += $question->points;
            }

            $breakdown[] = [
                'question_id' => $question->id,
                'question_text' => $question->question_text,
                'is_correct' => $isCorrect,
                'explanation' => $question->explanation,
                'selected_option_id' => $submitted ? (int) $submitted : null,
                'correct_option_id' => $correctOption?->id,
                'correct_option_text' => $correctOption?->option_text,
            ];
        }

        $percentage = $totalPoints > 0 ? round(($score / $totalPoints) * 100, 2) : 0;

        return [
            'score' => $score,
            'total_points' => $totalPoints,
            'percentage' => $percentage,
            'breakdown' => $breakdown,
        ];
    }

    public function submitQuiz(User $user, Quiz $quiz, array $answers, ?int $timeSpent = null): array
    {
        $evaluation = $this->calculateScore($quiz, $answers);
        $passingScore = $quiz->passing_score ?? 70;
        $passed = $evaluation['percentage'] >= $passingScore;
        $status = $passed ? 'pass' : 'fail';

        $result = QuizResult::create([
            'user_id' => $user->id,
            'quiz_id' => $quiz->id,
            'score' => $evaluation['score'],
            'total_points' => $evaluation['total_points'],
            'percentage' => $evaluation['percentage'],
            'status' => $status,
            'answers' => $answers,
            'time_spent' => $timeSpent,
            'completed_at' => Carbon::now(),
        ]);

        $quiz->increment('attempt_count');
        $quiz->update([
            'average_score' => QuizResult::where('quiz_id', $quiz->id)->avg('percentage'),
        ]);

        $badge = null;
        if ($passed && $evaluation['percentage'] >= 100) {
            $badge = [
                'key' => 'perfect_score',
                'label' => 'Score parfait',
                'description' => 'Vous avez répondu correctement à toutes les questions !',
            ];
        } elseif ($passed) {
            $badge = [
                'key' => 'passed',
                'label' => 'Quiz réussi',
                'description' => 'Bravo, vous avez atteint le seuil de réussite.',
            ];
        }

        $recommendedQuiz = $this->recommendNextQuiz($quiz, $evaluation['percentage'], $passed);

        return [
            'result' => $result,
            'passed' => $passed,
            'status' => $status,
            'percentage' => $evaluation['percentage'],
            'score' => $evaluation['score'],
            'total_points' => $evaluation['total_points'],
            'breakdown' => $evaluation['breakdown'],
            'badge' => $badge,
            'recommended_quiz' => $recommendedQuiz,
            'time_spent' => $timeSpent,
        ];
    }

    /**
     * Adaptive recommendation: 100% on Beginner → suggest Intermediate in same category.
     */
    public function recommendNextQuiz(Quiz $quiz, float $percentage, bool $passed): ?array
    {
        if (! $passed || $percentage < 100 || $quiz->difficulty !== 'beginner') {
            return null;
        }

        $next = Quiz::where('category', $quiz->category)
            ->where('difficulty', 'intermediate')
            ->whereKeyNot($quiz->id)
            ->withCount('questions')
            ->first();

        if (! $next) {
            return null;
        }

        return $this->formatQuizCard($next);
    }

    public function formatQuizCard(Quiz $quiz): array
    {
        if (! isset($quiz->questions_count)) {
            $quiz->loadCount('questions');
        }

        return [
            'id' => $quiz->id,
            'title' => $quiz->title,
            'description' => $quiz->description,
            'category' => $quiz->category,
            'difficulty' => $quiz->difficulty,
            'time_limit' => $quiz->time_limit ?? 300,
            'passing_score' => $quiz->passing_score ?? 70,
            'questions_count' => $quiz->questions_count,
        ];
    }

    public function listQuizzes(): Collection
    {
        return Quiz::withCount('questions')
            ->latest()
            ->get()
            ->map(fn (Quiz $quiz) => $this->formatQuizCard($quiz));
    }
}

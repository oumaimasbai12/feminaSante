<?php

namespace Tests\Feature;

use App\Models\Quiz\Question;
use App\Models\Quiz\QuestionOption;
use App\Models\Quiz\Quiz;
use App\Models\Quiz\QuizResult;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizTrackingTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    public function test_play_endpoint_hides_correct_answers(): void
    {
        $quiz = Quiz::factory()->create();
        $question = Question::factory()->create(['quiz_id' => $quiz->id]);
        QuestionOption::factory()->correct()->create(['question_id' => $question->id]);
        QuestionOption::factory()->create(['question_id' => $question->id]);

        $response = $this->getJson("/api/v1/quizzes/{$quiz->id}/play");

        $response->assertOk();
        $response->assertJsonMissing(['is_correct' => true]);
        $response->assertJsonStructure(['quiz' => ['questions', 'time_limit', 'passing_score']]);
    }

    public function test_check_answer_returns_explanation(): void
    {
        $quiz = Quiz::factory()->create();
        $question = Question::factory()->create([
            'quiz_id' => $quiz->id,
            'explanation' => 'Le cycle comporte 4 phases.',
        ]);
        $correct = QuestionOption::factory()->correct()->create(['question_id' => $question->id]);
        $wrong = QuestionOption::factory()->create(['question_id' => $question->id]);

        $response = $this->withToken($this->token)->postJson(
            "/api/v1/quizzes/{$quiz->id}/questions/{$question->id}/check",
            ['option_id' => $wrong->id]
        );

        $response->assertOk();
        $response->assertJsonPath('feedback.is_correct', false);
        $response->assertJsonPath('feedback.explanation', 'Le cycle comporte 4 phases.');
        $response->assertJsonPath('feedback.correct_option_text', $correct->option_text);
    }

    public function test_submit_sets_pass_status_and_recommends_intermediate(): void
    {
        $beginner = Quiz::factory()->create([
            'category' => 'cycle',
            'difficulty' => 'beginner',
            'passing_score' => 70,
        ]);
        $intermediate = Quiz::factory()->create([
            'category' => 'cycle',
            'difficulty' => 'intermediate',
        ]);

        $question = Question::factory()->create(['quiz_id' => $beginner->id, 'points' => 1]);
        $correct = QuestionOption::factory()->correct()->create(['question_id' => $question->id]);
        QuestionOption::factory()->create(['question_id' => $question->id]);

        $response = $this->withToken($this->token)->postJson("/api/v1/quizzes/{$beginner->id}/submit", [
            'answers' => [$question->id => $correct->id],
            'time_spent' => 95,
        ]);

        $response->assertCreated();
        $response->assertJsonPath('passed', true);
        $response->assertJsonPath('status', 'pass');
        $response->assertJsonPath('percentage', 100.0);
        $response->assertJsonPath('badge.key', 'perfect_score');
        $response->assertJsonPath('recommended_quiz.id', $intermediate->id);

        $this->assertDatabaseHas('quiz_results', [
            'user_id' => $this->user->id,
            'quiz_id' => $beginner->id,
            'status' => 'pass',
            'time_spent' => 95,
        ]);
    }

    public function test_submit_sets_fail_status(): void
    {
        $quiz = Quiz::factory()->create(['passing_score' => 70]);
        $question = Question::factory()->create(['quiz_id' => $quiz->id, 'points' => 1]);
        QuestionOption::factory()->correct()->create(['question_id' => $question->id]);
        $wrong = QuestionOption::factory()->create(['question_id' => $question->id]);

        $response = $this->withToken($this->token)->postJson("/api/v1/quizzes/{$quiz->id}/submit", [
            'answers' => [$question->id => $wrong->id],
        ]);

        $response->assertCreated();
        $response->assertJsonPath('passed', false);
        $response->assertJsonPath('status', 'fail');
        $response->assertJsonPath('recommended_quiz', null);
    }
}

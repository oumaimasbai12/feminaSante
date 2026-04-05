<?php

namespace Tests\Feature;

use App\Models\Quiz\Question;
use App\Models\Quiz\QuestionOption;
use App\Models\Quiz\Quiz;
use App\Models\Quiz\QuizResult;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuizTest extends TestCase
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

    // ──────────────────────────────────────────────────────────────
    // QUIZ CRUD
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_list_quizzes(): void
    {
        Quiz::factory()->count(3)->create();

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/quizzes');

        $response->assertOk();
        $response->assertJsonCount(3);
    }

    public function test_user_can_create_quiz(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/quizzes', [
                'title' => 'Quiz Cycle Menstruel',
                'description' => 'Testez vos connaissances',
                'category' => 'cycle',
                'difficulty' => 'beginner',
                'time_limit' => 300,
                'passing_score' => 70,
            ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Quiz created successfully.']);
        $response->assertJsonPath('quiz.difficulty', 'beginner');
        $response->assertJsonPath('quiz.passing_score', 70);
        $response->assertJsonPath('quiz.attempt_count', 0);
    }

    public function test_create_quiz_defaults(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/quizzes', [
                'title' => 'Quiz',
                'category' => 'general',
            ]);

        $response->assertCreated();
        $response->assertJsonPath('quiz.difficulty', 'beginner');
        $response->assertJsonPath('quiz.passing_score', 70);
    }

    public function test_create_quiz_fails_without_required_fields(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/quizzes', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['title', 'category']);
    }

    public function test_create_quiz_fails_with_invalid_category(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/quizzes', [
                'title' => 'Quiz',
                'category' => 'invalid',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('category');
    }

    public function test_create_quiz_fails_with_invalid_difficulty(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/quizzes', [
                'title' => 'Quiz',
                'category' => 'general',
                'difficulty' => 'expert',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('difficulty');
    }

    public function test_user_can_show_quiz_with_questions(): void
    {
        $quiz = Quiz::factory()->create();
        $question = Question::factory()->create(['quiz_id' => $quiz->id]);
        QuestionOption::factory()->count(4)->create(['question_id' => $question->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/quizzes/{$quiz->id}");

        $response->assertOk();
        $response->assertJsonPath('id', $quiz->id);
        $response->assertJsonCount(1, 'questions');
        $response->assertJsonCount(4, 'questions.0.options');
    }

    // ──────────────────────────────────────────────────────────────
    // QUESTIONS
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_create_question_with_options(): void
    {
        $quiz = Quiz::factory()->create();

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/quizzes/{$quiz->id}/questions", [
                'question_text' => 'Combien dure un cycle menstruel moyen ?',
                'type' => 'single',
                'points' => 2,
                'display_order' => 1,
                'explanation' => 'Le cycle menstruel moyen dure 28 jours.',
                'options' => [
                    ['option_text' => '21 jours', 'is_correct' => false, 'display_order' => 1],
                    ['option_text' => '28 jours', 'is_correct' => true, 'display_order' => 2],
                    ['option_text' => '35 jours', 'is_correct' => false, 'display_order' => 3],
                ],
            ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Question created successfully.']);
        $response->assertJsonCount(3, 'question.options');
    }

    public function test_create_question_fails_without_required_fields(): void
    {
        $quiz = Quiz::factory()->create();

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/quizzes/{$quiz->id}/questions", []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['question_text', 'display_order', 'options']);
    }

    public function test_create_question_fails_with_too_few_options(): void
    {
        $quiz = Quiz::factory()->create();

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/quizzes/{$quiz->id}/questions", [
                'question_text' => 'Question test',
                'display_order' => 1,
                'options' => [
                    ['option_text' => 'Seule option', 'is_correct' => true, 'display_order' => 1],
                ],
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('options');
    }

    // ──────────────────────────────────────────────────────────────
    // QUIZ RESULTS / SUBMIT
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_submit_quiz(): void
    {
        $quiz = Quiz::factory()->create();
        $question = Question::factory()->create([
            'quiz_id' => $quiz->id,
            'points' => 1,
        ]);
        $correctOption = QuestionOption::factory()->correct()->create([
            'question_id' => $question->id,
        ]);
        QuestionOption::factory()->create([
            'question_id' => $question->id,
        ]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/quizzes/{$quiz->id}/submit", [
                'answers' => [
                    $question->id => $correctOption->id,
                ],
                'time_spent' => 120,
            ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Quiz submitted successfully.']);
        $response->assertJsonPath('result.score', 1);
        $response->assertJsonPath('result.total_points', 1);
        $response->assertJsonPath('result.percentage', 100.0);

        // Check attempt_count incremented
        $this->assertEquals(1, $quiz->fresh()->attempt_count);
    }

    public function test_quiz_score_zero_with_wrong_answers(): void
    {
        $quiz = Quiz::factory()->create();
        $question = Question::factory()->create([
            'quiz_id' => $quiz->id,
            'points' => 2,
        ]);
        QuestionOption::factory()->correct()->create([
            'question_id' => $question->id,
        ]);
        $wrongOption = QuestionOption::factory()->create([
            'question_id' => $question->id,
        ]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/quizzes/{$quiz->id}/submit", [
                'answers' => [
                    $question->id => $wrongOption->id,
                ],
            ]);

        $response->assertCreated();
        $response->assertJsonPath('result.score', 0);
        $response->assertJsonPath('result.percentage', 0.0);
    }

    public function test_submit_quiz_fails_without_answers(): void
    {
        $quiz = Quiz::factory()->create();

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/quizzes/{$quiz->id}/submit", []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('answers');
    }

    // ──────────────────────────────────────────────────────────────
    // RELATIONSHIPS
    // ──────────────────────────────────────────────────────────────

    public function test_quiz_has_many_questions(): void
    {
        $quiz = Quiz::factory()->create();
        Question::factory()->count(5)->create(['quiz_id' => $quiz->id]);

        $this->assertCount(5, $quiz->questions);
    }

    public function test_quiz_has_many_results(): void
    {
        $quiz = Quiz::factory()->create();
        QuizResult::factory()->count(3)->create(['quiz_id' => $quiz->id]);

        $this->assertCount(3, $quiz->results);
    }

    public function test_question_has_many_options(): void
    {
        $question = Question::factory()->create();
        QuestionOption::factory()->count(4)->create(['question_id' => $question->id]);

        $this->assertCount(4, $question->options);
    }

    public function test_unauthenticated_user_cannot_access_quizzes(): void
    {
        $response = $this->getJson('/api/v1/quizzes');
        $response->assertUnauthorized();
    }
}

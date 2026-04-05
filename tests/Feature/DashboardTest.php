<?php

namespace Tests\Feature;

use App\Models\AppNotification;
use App\Models\Articles\Article;
use App\Models\Articles\ArticleCategory;
use App\Models\Assistant\Chat;
use App\Models\Appointments\Appointment;
use App\Models\Appointments\Gynecologist;
use App\Models\Cycle;
use App\Models\Menopause\Menopause;
use App\Models\Prediction;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Quiz\Quiz;
use App\Models\Quiz\QuizResult;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
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

    public function test_user_can_view_dashboard_summary(): void
    {
        Cycle::create([
            'user_id' => $this->user->id,
            'start_date' => '2026-03-20',
            'end_date' => '2026-03-25',
            'phase' => 'menstruation',
        ]);

        Pregnancy::factory()->create([
            'user_id' => $this->user->id,
            'statuts' => 'ongoing',
        ]);

        Menopause::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'ongoing',
        ]);

        Prediction::create([
            'user_id' => $this->user->id,
            'predicted_date' => now()->addDays(5)->toDateString(),
            'type' => 'ovulation',
            'confidence' => 'high',
            'cycle_length_avg' => 28,
        ]);

        $gynecologist = Gynecologist::factory()->create();

        Appointment::factory()->create([
            'user_id' => $this->user->id,
            'gynecologist_id' => $gynecologist->id,
            'status' => 'confirmed',
            'start_time' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addMinutes(30),
        ]);

        AppNotification::factory()->count(2)->create([
            'user_id' => $this->user->id,
            'read_at' => null,
        ]);

        Chat::factory()->count(2)->create([
            'user_id' => $this->user->id,
        ]);

        $quiz = Quiz::factory()->create();
        QuizResult::factory()->create([
            'user_id' => $this->user->id,
            'quiz_id' => $quiz->id,
            'percentage' => 85,
        ]);

        $category = ArticleCategory::factory()->create();
        Article::factory()->count(2)->create([
            'category_id' => $category->id,
            'status' => 'published',
            'is_featured' => true,
        ]);

        $response = $this->withToken($this->token)->getJson('/api/v1/dashboard');

        $response->assertOk();
        $response->assertJsonPath('user.id', $this->user->id);
        $response->assertJsonPath('stats.cycles_count', 1);
        $response->assertJsonPath('stats.pregnancies_count', 1);
        $response->assertJsonPath('stats.menopauses_count', 1);
        $response->assertJsonPath('stats.appointments_count', 1);
        $response->assertJsonPath('stats.quiz_results_count', 1);
        $response->assertJsonPath('stats.unread_notifications_count', 2);
        $response->assertJsonPath('stats.chat_messages_count', 2);
        $response->assertJsonPath('health_overview.active_pregnancy.user_id', $this->user->id);
        $response->assertJsonPath('health_overview.active_menopause.user_id', $this->user->id);
        $response->assertJsonPath('care.next_appointment.user_id', $this->user->id);
        $response->assertJsonPath('learning.latest_quiz_result.user_id', $this->user->id);
        $response->assertJsonCount(2, 'learning.featured_articles');
    }

    public function test_unauthenticated_user_cannot_access_dashboard(): void
    {
        $this->getJson('/api/v1/dashboard')->assertUnauthorized();
    }
}

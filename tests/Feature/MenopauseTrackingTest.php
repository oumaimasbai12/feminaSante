<?php

namespace Tests\Feature;

use App\Models\Menopause\Menopause;
use App\Models\Menopause\MenopauseSymptom;
use App\Models\Menopause\MenopauseSymptomLog;
use App\Models\User;
use App\Services\MenopauseService;
use Carbon\Carbon;
use Database\Seeders\MenopauseSymptomSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenopauseTrackingTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(MenopauseSymptomSeeder::class);
        $this->user = User::factory()->create([
            'birth_date' => Carbon::today()->subYears(50),
        ]);
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    public function test_twelve_month_rule_classifies_postmenopause(): void
    {
        $service = app(MenopauseService::class);
        $lastPeriod = Carbon::today()->subMonths(13);

        $stage = $service->classifyStage($lastPeriod);

        $this->assertEquals('postmenopause', $stage->value);
    }

    public function test_twelve_month_rule_classifies_perimenopause(): void
    {
        $service = app(MenopauseService::class);
        $lastPeriod = Carbon::today()->subMonths(6);

        $stage = $service->classifyStage($lastPeriod);

        $this->assertEquals('perimenopause', $stage->value);
    }

    public function test_creating_profile_auto_classifies_stage(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/menopauses', [
            'last_period_date' => Carbon::today()->subMonths(14)->toDateString(),
            'age_at_onset' => 48,
            'symptom_history_months' => 18,
            'hot_flashes' => true,
        ]);

        $response->assertCreated();
        $response->assertJsonPath('menopause.stage', 'postmenopause');
    }

    public function test_dashboard_returns_insights_and_charts(): void
    {
        $menopause = Menopause::factory()->create([
            'user_id' => $this->user->id,
            'last_period_date' => Carbon::today()->subMonths(3),
        ]);

        MenopauseSymptomLog::factory()->count(5)->create([
            'menopause_id' => $menopause->id,
            'log_date' => Carbon::today()->subDays(2),
            'mood_score' => 6,
            'sleep_quality' => 7,
            'stress_level' => 8,
            'hot_flashes' => true,
            'caffeine_cups' => 4,
        ]);

        $response = $this->withToken($this->token)->getJson("/api/v1/menopauses/{$menopause->id}/dashboard");

        $response->assertOk();
        $response->assertJsonStructure([
            'dashboard' => [
                'profile',
                'stage_tip',
                'insights',
                'charts' => ['mood_chart', 'sleep_chart', 'symptom_frequency'],
                'correlations',
                'recent_logs',
                'symptom_catalog',
            ],
        ]);
    }

    public function test_symptom_log_syncs_catalog_pivot(): void
    {
        $menopause = Menopause::factory()->create(['user_id' => $this->user->id]);
        $symptom = MenopauseSymptom::where('slug', 'fatigue')->first();

        $response = $this->withToken($this->token)->postJson("/api/v1/menopauses/{$menopause->id}/symptom-logs", [
            'log_date' => Carbon::today()->toDateString(),
            'severity' => 'moderate',
            'mood_score' => 5,
            'sleep_quality' => 5,
            'catalog_symptoms' => [
                ['symptom_id' => $symptom->id, 'intensity' => 3],
            ],
        ]);

        $response->assertCreated();
        $logId = $response->json('log.id');

        $this->assertDatabaseHas('menopause_symptom_log_symptom', [
            'menopause_symptom_log_id' => $logId,
            'menopause_symptom_id' => $symptom->id,
            'intensity' => 3,
        ]);
    }

    public function test_dashboard_symptom_frequency_counts_catalog_symptoms(): void
    {
        $menopause = Menopause::factory()->create(['user_id' => $this->user->id]);
        $hotFlashes = MenopauseSymptom::where('slug', 'hot_flashes')->first();

        $this->withToken($this->token)->postJson("/api/v1/menopauses/{$menopause->id}/symptom-logs", [
            'log_date' => Carbon::today()->toDateString(),
            'severity' => 'moderate',
            'mood_score' => 5,
            'sleep_quality' => 6,
            'catalog_symptoms' => [
                ['symptom_id' => $hotFlashes->id, 'intensity' => 2],
            ],
        ])->assertCreated();

        $response = $this->withToken($this->token)->getJson("/api/v1/menopauses/{$menopause->id}/dashboard");

        $response->assertOk();
        $frequency = collect($response->json('dashboard.charts.symptom_frequency'));
        $this->assertSame(1, $frequency->firstWhere('slug', 'hot_flashes')['count']);
    }

    public function test_dashboard_hot_flash_count_includes_catalog_symptoms(): void
    {
        $menopause = Menopause::factory()->create(['user_id' => $this->user->id]);
        $hotFlashes = MenopauseSymptom::where('slug', 'hot_flashes')->first();

        $log = MenopauseSymptomLog::factory()->create([
            'menopause_id' => $menopause->id,
            'log_date' => Carbon::today(),
            'hot_flashes' => false,
        ]);
        $log->catalogSymptoms()->attach($hotFlashes->id, ['intensity' => 2]);

        $response = $this->withToken($this->token)->getJson("/api/v1/menopauses/{$menopause->id}/dashboard");

        $response->assertOk();
        $response->assertJsonPath('dashboard.insights.hot_flash_count', 1);
    }

    public function test_symptom_catalog_endpoint_returns_seeded_symptoms(): void
    {
        $response = $this->withToken($this->token)->getJson('/api/v1/menopause-symptoms/catalog');

        $response->assertOk();
        $response->assertJsonCount(12, 'symptoms');
    }
}

<?php

namespace Tests\Feature;

use App\Models\Pregnancy\Pregnancy;
use App\Models\Pregnancy\PregnancyMilestone;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PregnancyTrackingTest extends TestCase
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

    public function test_creating_pregnancy_schedules_milestones_and_notification(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/pregnancies', [
            'start_date' => now()->subWeeks(10)->toDateString(),
            'pregnancy_type' => 'simple',
        ]);

        $response->assertCreated();

        $pregnancy = Pregnancy::first();
        $this->assertNotNull($pregnancy);
        $this->assertGreaterThanOrEqual(8, PregnancyMilestone::where('pregnancy_id', $pregnancy->id)->count());
        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->user->id,
            'type' => 'pregnancy',
        ]);
    }

    public function test_dashboard_returns_weekly_tip_and_progress(): void
    {
        $pregnancy = Pregnancy::factory()->create([
            'user_id' => $this->user->id,
            'start_date' => now()->subWeeks(12)->toDateString(),
            'statuts' => 'ongoing',
        ]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/pregnancies/{$pregnancy->id}/dashboard");

        $response->assertOk();
        $response->assertJsonPath('dashboard.current_week', 13);
        $response->assertJsonStructure([
            'dashboard' => [
                'current_week',
                'progress_percent',
                'weekly_tip' => ['week', 'title', 'tip', 'baby_size'],
                'milestones',
                'weight_chart',
            ],
        ]);
    }

    public function test_medical_export_returns_pdf_document(): void
    {
        $pregnancy = Pregnancy::factory()->create([
            'user_id' => $this->user->id,
            'start_date' => now()->subWeeks(8)->toDateString(),
        ]);

        $response = $this->withToken($this->token)
            ->get("/api/v1/pregnancies/{$pregnancy->id}/export");

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
        $this->assertStringStartsWith('%PDF', $response->getContent());
    }
}

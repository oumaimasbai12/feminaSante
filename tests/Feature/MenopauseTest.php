<?php

namespace Tests\Feature;

use App\Models\Menopause\Menopause;
use App\Models\Menopause\MenopauseSymptomLog;
use App\Models\Menopause\MenopauseTreatment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenopauseTest extends TestCase
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

    public function test_user_can_list_own_menopause_records(): void
    {
        Menopause::factory()->count(2)->create(['user_id' => $this->user->id]);
        Menopause::factory()->create();

        $response = $this->withToken($this->token)->getJson('/api/v1/menopauses');

        $response->assertOk();
        $response->assertJsonCount(2);
    }

    public function test_user_can_create_menopause_record(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/menopauses', [
            'last_period_date' => '2025-04-10',
            'diagnosis_date' => '2026-01-05',
            'stage' => 'perimenopause',
            'status' => 'ongoing',
            'symptoms' => ['hot flashes', 'sleep changes'],
            'cycle_irregularity' => true,
            'hot_flashes' => true,
            'sleep_changes' => true,
            'notes' => 'Symptoms are becoming more frequent.',
        ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Menopause record created successfully.']);
        $response->assertJsonPath('menopause.stage', 'perimenopause');
        $response->assertJsonPath('menopause.status', 'ongoing');
        $response->assertJsonPath('menopause.hot_flashes', true);
    }

    public function test_user_cannot_create_second_ongoing_menopause_record(): void
    {
        Menopause::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'ongoing',
        ]);

        $response = $this->withToken($this->token)->postJson('/api/v1/menopauses', [
            'stage' => 'menopause',
            'status' => 'ongoing',
        ]);

        $response->assertStatus(422);
        $response->assertJsonFragment(['message' => 'You already have an ongoing menopause record.']);
    }

    public function test_user_can_show_own_menopause_record(): void
    {
        $menopause = Menopause::factory()->create(['user_id' => $this->user->id]);
        MenopauseSymptomLog::factory()->create([
            'menopause_id' => $menopause->id,
            'log_date' => '2026-03-10',
        ]);
        MenopauseTreatment::factory()->create([
            'menopause_id' => $menopause->id,
            'name' => 'Hormone therapy',
        ]);

        $response = $this->withToken($this->token)->getJson("/api/v1/menopauses/{$menopause->id}");

        $response->assertOk();
        $response->assertJsonPath('id', $menopause->id);
        $response->assertJsonPath('symptom_logs_count', 1);
        $response->assertJsonPath('treatments_count', 1);
        $response->assertJsonCount(1, 'symptom_logs');
        $response->assertJsonCount(1, 'treatments');
    }

    public function test_user_cannot_show_another_users_menopause_record(): void
    {
        $menopause = Menopause::factory()->create();

        $response = $this->withToken($this->token)->getJson("/api/v1/menopauses/{$menopause->id}");

        $response->assertForbidden();
    }

    public function test_user_can_update_menopause_record(): void
    {
        $menopause = Menopause::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'completed',
        ]);

        $response = $this->withToken($this->token)->putJson("/api/v1/menopauses/{$menopause->id}", [
            'stage' => 'postmenopause',
            'hot_flashes' => false,
            'night_sweats' => true,
        ]);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Menopause record updated successfully.']);
        $response->assertJsonPath('menopause.stage', 'postmenopause');
        $response->assertJsonPath('menopause.night_sweats', true);
    }

    public function test_user_can_delete_menopause_record(): void
    {
        $menopause = Menopause::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)->deleteJson("/api/v1/menopauses/{$menopause->id}");

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Menopause record deleted successfully.']);
        $this->assertDatabaseMissing('menopauses', ['id' => $menopause->id]);
    }

    public function test_user_can_create_and_manage_menopause_symptom_logs(): void
    {
        $menopause = Menopause::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'ongoing',
        ]);

        $createResponse = $this->withToken($this->token)
            ->postJson("/api/v1/menopauses/{$menopause->id}/symptom-logs", [
                'log_date' => '2026-04-03',
                'symptoms' => ['hot flashes', 'brain fog'],
                'severity' => 'severe',
                'sleep_quality' => 3,
                'mood_score' => 4,
                'hot_flashes' => true,
                'sleep_changes' => true,
                'notes' => 'Symptoms were intense in the afternoon.',
            ]);

        $createResponse->assertCreated();
        $createResponse->assertJsonPath('log.severity', 'severe');
        $createResponse->assertJsonPath('log.hot_flashes', true);

        $logId = $createResponse->json('log.id');

        $this->withToken($this->token)
            ->getJson("/api/v1/menopauses/{$menopause->id}/symptom-logs")
            ->assertOk()
            ->assertJsonCount(1);

        $this->withToken($this->token)
            ->getJson("/api/v1/menopause-symptom-logs/{$logId}")
            ->assertOk()
            ->assertJsonPath('id', $logId);

        $this->withToken($this->token)
            ->putJson("/api/v1/menopause-symptom-logs/{$logId}", [
                'severity' => 'moderate',
                'mood_score' => 6,
                'night_sweats' => true,
            ])
            ->assertOk()
            ->assertJsonPath('log.severity', 'moderate')
            ->assertJsonPath('log.night_sweats', true);

        $this->withToken($this->token)
            ->deleteJson("/api/v1/menopause-symptom-logs/{$logId}")
            ->assertOk()
            ->assertJsonPath('message', 'Menopause symptom log deleted successfully.');

        $this->assertDatabaseMissing('menopause_symptom_logs', ['id' => $logId]);
    }

    public function test_user_can_create_and_manage_menopause_treatments(): void
    {
        $menopause = Menopause::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'ongoing',
        ]);

        $createResponse = $this->withToken($this->token)
            ->postJson("/api/v1/menopauses/{$menopause->id}/treatments", [
                'treatment_type' => 'medication',
                'name' => 'Hormone therapy',
                'description' => 'Low-dose treatment supervised by a doctor.',
                'start_date' => '2026-04-03',
                'status' => 'active',
                'relieves_hot_flashes' => true,
                'relieves_sleep_changes' => true,
                'notes' => 'Started after specialist recommendation.',
            ]);

        $createResponse->assertCreated();
        $createResponse->assertJsonPath('treatment.name', 'Hormone therapy');
        $createResponse->assertJsonPath('treatment.relieves_hot_flashes', true);

        $treatmentId = $createResponse->json('treatment.id');

        $this->withToken($this->token)
            ->getJson("/api/v1/menopauses/{$menopause->id}/treatments")
            ->assertOk()
            ->assertJsonCount(1);

        $this->withToken($this->token)
            ->getJson("/api/v1/menopause-treatments/{$treatmentId}")
            ->assertOk()
            ->assertJsonPath('id', $treatmentId);

        $this->withToken($this->token)
            ->putJson("/api/v1/menopause-treatments/{$treatmentId}", [
                'status' => 'completed',
                'end_date' => '2026-06-03',
                'relieves_mood_changes' => true,
            ])
            ->assertOk()
            ->assertJsonPath('treatment.status', 'completed')
            ->assertJsonPath('treatment.relieves_mood_changes', true);

        $this->withToken($this->token)
            ->deleteJson("/api/v1/menopause-treatments/{$treatmentId}")
            ->assertOk()
            ->assertJsonPath('message', 'Menopause treatment deleted successfully.');

        $this->assertDatabaseMissing('menopause_treatments', ['id' => $treatmentId]);
    }

    public function test_unauthenticated_user_cannot_access_menopause_routes(): void
    {
        $this->getJson('/api/v1/menopauses')->assertUnauthorized();
    }
}

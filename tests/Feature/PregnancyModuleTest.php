<?php

namespace Tests\Feature;

use App\Models\Pregnancy\Pregnancy;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PregnancyModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_a_pregnancy_and_related_tracking_entries(): void
    {
        Carbon::setTestNow('2026-04-02 10:00:00');

        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $pregnancyResponse = $this->postJson('/api/v1/pregnancies', [
            'start_date' => '2026-01-01',
            'pregnancy_type' => 'simple',
            'high_risk' => true,
            'medical_conditions' => ['anemia'],
        ]);

        $pregnancyResponse
            ->assertCreated()
            ->assertJsonPath('pregnancy.user_id', $user->id)
            ->assertJsonPath('pregnancy.statuts', 'ongoing')
            ->assertJsonPath('pregnancy.current_week', 14);

        $this->assertStringStartsWith('2026-10-08', $pregnancyResponse->json('pregnancy.due_date'));

        $pregnancyId = $pregnancyResponse->json('pregnancy.id');

        $this->postJson("/api/v1/pregnancies/{$pregnancyId}/checkups", [
            'checkup_date' => '2026-04-02',
            'week' => 14,
            'checkup_type' => 'routine',
            'doctor_name' => 'Dr. Amal',
            'blood_pressure_systolic' => 120,
            'blood_pressure_diastolic' => 80,
        ])->assertCreated();

        $this->postJson("/api/v1/pregnancies/{$pregnancyId}/kicks", [
            'date' => '2026-04-02',
            'start_time' => '09:00',
            'end_time' => '09:45',
            'kicks_count' => 12,
            'activity_level' => 'normal',
        ])->assertCreated();

        $this->postJson("/api/v1/pregnancies/{$pregnancyId}/contractions", [
            'start_time' => '2026-04-02 11:00:00',
            'end_time' => '2026-04-02 11:01:20',
            'duration_seconds' => 80,
            'interval_seconds' => 300,
            'intensity' => 'mild',
        ])->assertCreated();

        $this->postJson("/api/v1/pregnancies/{$pregnancyId}/weight-gains", [
            'date' => '2026-04-02',
            'week' => 14,
            'weight' => 63.4,
            'bmi' => 23.1,
        ])->assertCreated();

        $this->getJson("/api/v1/pregnancies/{$pregnancyId}")
            ->assertOk()
            ->assertJsonPath('checkups_count', 1)
            ->assertJsonPath('kick_counters_count', 1)
            ->assertJsonPath('contractions_count', 1)
            ->assertJsonPath('weight_gains_count', 1)
            ->assertJsonCount(1, 'checkups')
            ->assertJsonCount(1, 'kick_counters')
            ->assertJsonCount(1, 'contractions')
            ->assertJsonCount(1, 'weight_gains');

        Carbon::setTestNow();
    }

    public function test_user_cannot_create_two_ongoing_pregnancies(): void
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $this->postJson('/api/v1/pregnancies', [
            'start_date' => '2026-01-01',
        ])->assertCreated();

        $this->postJson('/api/v1/pregnancies', [
            'start_date' => '2026-03-01',
        ])
            ->assertStatus(422)
            ->assertJsonPath('message', 'You already have an ongoing pregnancy.');
    }
}

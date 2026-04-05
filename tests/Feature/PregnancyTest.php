<?php

namespace Tests\Feature;

use App\Models\Pregnancy\Contraction;
use App\Models\Pregnancy\KickCounter;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Pregnancy\PregnancyCheckup;
use App\Models\User;
use App\Models\Pregnancy\WeightGain;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PregnancyTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    // ──────────────────────────────────────────────────────────────
    // PREGNANCY CRUD
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_list_their_pregnancies(): void
    {
        Pregnancy::factory()->count(3)->create(['user_id' => $this->user->id]);

        // Other user's pregnancy should not appear
        Pregnancy::factory()->create();

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/pregnancies');

        $response->assertOk();
        $response->assertJsonCount(3);
    }

    public function test_user_can_create_pregnancy_with_required_fields(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/pregnancies', [
                'start_date' => '2026-01-15',
            ]);

        $response->assertCreated();
        $response->assertJsonFragment([
            'message' => 'Pregnancy created successfully.',
        ]);
        $response->assertJsonPath('pregnancy.start_date', '2026-01-15T00:00:00.000000Z');
        $response->assertJsonPath('pregnancy.pregnancy_type', 'simple');
        $response->assertJsonPath('pregnancy.statuts', 'ongoing');
        $response->assertJsonPath('pregnancy.high_risk', false);

        $this->assertDatabaseHas('pregnancies', [
            'user_id' => $this->user->id,
            'start_date' => '2026-01-15 00:00:00',
        ]);
    }

    public function test_user_can_create_pregnancy_with_all_fields(): void
    {
        $payload = [
            'start_date' => '2026-01-15',
            'due_date' => '2026-10-15',
            'conception_date' => '2026-01-01',
            'pregnancy_type' => 'twins',
            'statuts' => 'ongoing',
            'high_risk' => true,
            'risk_factors' => 'Hypertension',
            'blood_type' => 'A+',
            'rhesus_negative' => true,
            'allergies' => ['penicillin', 'latex'],
            'medical_conditions' => ['diabetes'],
            'notes' => 'Suivi rapproché nécessaire.',
        ];

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/pregnancies', $payload);

        $response->assertCreated();
        $response->assertJsonPath('pregnancy.pregnancy_type', 'twins');
        $response->assertJsonPath('pregnancy.high_risk', true);
        $response->assertJsonPath('pregnancy.rhesus_negative', true);
        $response->assertJsonPath('pregnancy.allergies', ['penicillin', 'latex']);
    }

    public function test_create_pregnancy_fails_without_start_date(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/pregnancies', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('start_date');
    }

    public function test_create_pregnancy_fails_with_invalid_pregnancy_type(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/pregnancies', [
                'start_date' => '2026-01-15',
                'pregnancy_type' => 'invalid_type',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('pregnancy_type');
    }

    public function test_create_pregnancy_fails_with_invalid_status(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/pregnancies', [
                'start_date' => '2026-01-15',
                'statuts' => 'invalid_status',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('statuts');
    }

    public function test_user_can_show_their_pregnancy(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/pregnancies/{$pregnancy->id}");

        $response->assertOk();
        $response->assertJsonPath('id', $pregnancy->id);
    }

    public function test_show_pregnancy_loads_related_data(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        PregnancyCheckup::factory()->create(['pregnancy_id' => $pregnancy->id]);
        KickCounter::factory()->create(['pregnancy_id' => $pregnancy->id]);
        Contraction::factory()->create(['pregnancy_id' => $pregnancy->id]);
        WeightGain::factory()->create(['pregnancy_id' => $pregnancy->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/pregnancies/{$pregnancy->id}");

        $response->assertOk();
        $response->assertJsonCount(1, 'checkups');
        $response->assertJsonCount(1, 'kick_counters');
        $response->assertJsonCount(1, 'contractions');
        $response->assertJsonCount(1, 'weight_gains');
    }

    public function test_user_cannot_show_another_users_pregnancy(): void
    {
        $otherUser = User::factory()->create();
        $pregnancy = Pregnancy::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/pregnancies/{$pregnancy->id}");

        $response->assertForbidden();
        $response->assertJsonFragment(['message' => 'Unauthorized.']);
    }

    public function test_unauthenticated_user_cannot_access_pregnancies(): void
    {
        $response = $this->getJson('/api/v1/pregnancies');
        $response->assertUnauthorized();
    }

    // ──────────────────────────────────────────────────────────────
    // PREGNANCY CHECKUPS
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_create_checkup_for_their_pregnancy(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'checkup_date' => '2026-03-15',
            'week' => 12,
            'checkup_type' => 'first_trimester',
            'doctor_name' => 'Dr. Martin',
            'hospital_name' => 'CHU Rabat',
            'weight' => 65.5,
            'blood_pressure_systolic' => 120,
            'blood_pressure_diastolic' => 80,
            'fundal_height' => 15.5,
            'fetal_heart_rate' => '140 bpm',
            'observations' => ['RAS', 'Bonne croissance'],
            'prescriptions' => ['Acide folique'],
            'next_appointement' => '2026-04-15',
            'notes' => 'Tout va bien.',
        ];

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/checkups", $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Checkup created successfully.']);
        $response->assertJsonPath('checkup.week', 12);
        $response->assertJsonPath('checkup.checkup_type', 'first_trimester');

        $this->assertDatabaseHas('pregnancy_checkups', [
            'pregnancy_id' => $pregnancy->id,
            'week' => 12,
            'checkup_type' => 'first_trimester',
            'doctor_name' => 'Dr. Martin',
        ]);
    }

    public function test_create_checkup_fails_without_required_fields(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/checkups", []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['checkup_date', 'week', 'checkup_type', 'blood_pressure_systolic', 'blood_pressure_diastolic']);
    }

    public function test_user_cannot_create_checkup_for_another_users_pregnancy(): void
    {
        $otherUser = User::factory()->create();
        $pregnancy = Pregnancy::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/checkups", [
                'checkup_date' => '2026-03-15',
                'week' => 12,
                'checkup_type' => 'routine',
                'blood_pressure_systolic' => 120,
                'blood_pressure_diastolic' => 80,
            ]);

        $response->assertForbidden();
    }

    // ──────────────────────────────────────────────────────────────
    // KICK COUNTERS
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_create_kick_counter(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'date' => '2026-03-15',
            'start_time' => '10:00:00',
            'end_time' => '10:25:00',
            'kicks_count' => 15,
            'time_to_10_kicks' => '<30min',
            'activity_level' => 'normal',
            'notes' => 'Bébé très actif.',
        ];

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/kicks", $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Kick counter created successfully.']);
        $response->assertJsonPath('kick_counter.kicks_count', 15);

        $this->assertDatabaseHas('kick_counters', [
            'pregnancy_id' => $pregnancy->id,
            'kicks_count' => 15,
        ]);
    }

    public function test_kick_counter_defaults_kicks_count_to_zero(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/kicks", [
                'date' => '2026-03-15',
                'start_time' => '10:00:00',
            ]);

        $response->assertCreated();
        $response->assertJsonPath('kick_counter.kicks_count', 0);
    }

    public function test_create_kick_counter_fails_without_required_fields(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/kicks", []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['date', 'start_time']);
    }

    public function test_user_cannot_create_kick_counter_for_another_users_pregnancy(): void
    {
        $otherUser = User::factory()->create();
        $pregnancy = Pregnancy::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/kicks", [
                'date' => '2026-03-15',
                'start_time' => '10:00:00',
            ]);

        $response->assertForbidden();
    }

    // ──────────────────────────────────────────────────────────────
    // CONTRACTIONS
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_create_contraction(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'start_time' => '2026-03-15 14:00:00',
            'end_time' => '2026-03-15 14:01:00',
            'duration_seconds' => 60,
            'interval_seconds' => 300,
            'intensity' => 'moderate',
            'is_active' => true,
            'notes' => 'Contraction régulière.',
        ];

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/contractions", $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Contraction created successfully.']);
        $response->assertJsonPath('contraction.duration_seconds', 60);
        $response->assertJsonPath('contraction.intensity', 'moderate');

        $this->assertDatabaseHas('contractions', [
            'pregnancy_id' => $pregnancy->id,
            'duration_seconds' => 60,
            'intensity' => 'moderate',
        ]);
    }

    public function test_contraction_defaults_is_active_to_false(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/contractions", [
                'start_time' => '2026-03-15 14:00:00',
                'duration_seconds' => 45,
                'interval_seconds' => 180,
            ]);

        $response->assertCreated();
        $response->assertJsonPath('contraction.is_active', false);
    }

    public function test_create_contraction_fails_without_required_fields(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/contractions", []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['start_time', 'duration_seconds', 'interval_seconds']);
    }

    public function test_create_contraction_fails_with_invalid_intensity(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/contractions", [
                'start_time' => '2026-03-15 14:00:00',
                'duration_seconds' => 45,
                'interval_seconds' => 180,
                'intensity' => 'extreme',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('intensity');
    }

    public function test_user_cannot_create_contraction_for_another_users_pregnancy(): void
    {
        $otherUser = User::factory()->create();
        $pregnancy = Pregnancy::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/contractions", [
                'start_time' => '2026-03-15 14:00:00',
                'duration_seconds' => 45,
                'interval_seconds' => 180,
            ]);

        $response->assertForbidden();
    }

    // ──────────────────────────────────────────────────────────────
    // WEIGHT GAINS
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_create_weight_gain(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $payload = [
            'date' => '2026-03-15',
            'week' => 20,
            'weight' => 72.5,
            'bmi' => 25.3,
            'notes' => 'Prise de poids normale.',
        ];

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/weight-gains", $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Weight gain entry created successfully.']);
        $response->assertJsonPath('weight_gain.week', 20);

        $this->assertDatabaseHas('weight_gains', [
            'pregnancy_id' => $pregnancy->id,
            'week' => 20,
            'weight' => 72.5,
        ]);
    }

    public function test_create_weight_gain_fails_without_required_fields(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/weight-gains", []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['date', 'week', 'weight']);
    }

    public function test_user_cannot_create_weight_gain_for_another_users_pregnancy(): void
    {
        $otherUser = User::factory()->create();
        $pregnancy = Pregnancy::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->withToken($this->token)
            ->postJson("/api/v1/pregnancies/{$pregnancy->id}/weight-gains", [
                'date' => '2026-03-15',
                'week' => 20,
                'weight' => 72.5,
            ]);

        $response->assertForbidden();
    }

    // ──────────────────────────────────────────────────────────────
    // MODEL: current_week accessor
    // ──────────────────────────────────────────────────────────────

    public function test_pregnancy_current_week_accessor(): void
    {
        $pregnancy = Pregnancy::factory()->create([
            'user_id' => $this->user->id,
            'start_date' => now()->subWeeks(10),
        ]);

        $this->assertEquals(11, $pregnancy->current_week);
    }

    public function test_pregnancy_current_week_returns_null_without_start_date(): void
    {
        $pregnancy = Pregnancy::factory()->create([
            'user_id' => $this->user->id,
            'start_date' => now(),
        ]);

        // Manually set start_date to null to test the accessor guard clause
        $pregnancy->start_date = null;

        $this->assertNull($pregnancy->current_week);
    }

    // ──────────────────────────────────────────────────────────────
    // MODEL: relationships
    // ──────────────────────────────────────────────────────────────

    public function test_pregnancy_belongs_to_user(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);

        $this->assertInstanceOf(User::class, $pregnancy->user);
        $this->assertEquals($this->user->id, $pregnancy->user->id);
    }

    public function test_pregnancy_has_many_checkups(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);
        PregnancyCheckup::factory()->count(3)->create(['pregnancy_id' => $pregnancy->id]);

        $this->assertCount(3, $pregnancy->checkups);
    }

    public function test_pregnancy_has_many_kick_counters(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);
        KickCounter::factory()->count(2)->create(['pregnancy_id' => $pregnancy->id]);

        $this->assertCount(2, $pregnancy->kickCounters);
    }

    public function test_pregnancy_has_many_contractions(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);
        Contraction::factory()->count(4)->create(['pregnancy_id' => $pregnancy->id]);

        $this->assertCount(4, $pregnancy->contractions);
    }

    public function test_pregnancy_has_many_weight_gains(): void
    {
        $pregnancy = Pregnancy::factory()->create(['user_id' => $this->user->id]);
        WeightGain::factory()->count(5)->create(['pregnancy_id' => $pregnancy->id]);

        $this->assertCount(5, $pregnancy->weightGains);
    }

    public function test_user_has_many_pregnancies(): void
    {
        Pregnancy::factory()->count(2)->create(['user_id' => $this->user->id]);

        $this->assertCount(2, $this->user->pregnancies);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Cycle;
use App\Models\Symptom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CycleTest extends TestCase
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
    // INDEX
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_list_their_cycles(): void
    {
        Cycle::factory()->count(3)->create(['user_id' => $this->user->id]);
        Cycle::factory()->create(); // other user

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/cycles');

        $response->assertOk();
        $response->assertJsonCount(3);
    }

    // ──────────────────────────────────────────────────────────────
    // STORE
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_create_cycle(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/cycles', [
                'start_date' => '2026-03-01',
                'end_date' => '2026-03-06',
                'phase' => 'menstruation',
                'flow_intensity' => 'medium',
                'mood' => 'calm',
                'notes' => 'Cycle normal.',
            ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Cycle created successfully.']);
    }

    public function test_create_cycle_with_symptoms(): void
    {
        $symptoms = Symptom::factory()->count(2)->create();

        $response = $this->withToken($this->token)
            ->postJson('/api/v1/cycles', [
                'start_date' => '2026-03-01',
                'end_date' => '2026-03-06',
                'symptom_ids' => $symptoms->pluck('id')->toArray(),
            ]);

        $response->assertCreated();

        $cycle = Cycle::where('user_id', $this->user->id)->first();
        $this->assertCount(2, $cycle->symptoms);
    }

    public function test_create_cycle_fails_without_required_fields(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/cycles', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['start_date', 'end_date']);
    }

    public function test_create_cycle_fails_with_end_before_start(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/cycles', [
                'start_date' => '2026-03-10',
                'end_date' => '2026-03-05',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('end_date');
    }

    public function test_create_cycle_fails_with_invalid_phase(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/cycles', [
                'start_date' => '2026-03-01',
                'end_date' => '2026-03-06',
                'phase' => 'invalid',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('phase');
    }

    public function test_create_cycle_fails_with_invalid_flow_intensity(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/cycles', [
                'start_date' => '2026-03-01',
                'end_date' => '2026-03-06',
                'flow_intensity' => 'extreme',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('flow_intensity');
    }

    public function test_create_cycle_fails_with_invalid_mood(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/cycles', [
                'start_date' => '2026-03-01',
                'end_date' => '2026-03-06',
                'mood' => 'ecstatic',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('mood');
    }

    // ──────────────────────────────────────────────────────────────
    // SHOW
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_show_their_cycle(): void
    {
        $cycle = Cycle::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/cycles/{$cycle->id}");

        $response->assertOk();
        $response->assertJsonPath('id', $cycle->id);
    }

    public function test_user_cannot_show_another_users_cycle(): void
    {
        $cycle = Cycle::factory()->create();

        $response = $this->withToken($this->token)
            ->getJson("/api/v1/cycles/{$cycle->id}");

        $response->assertForbidden();
    }

    // ──────────────────────────────────────────────────────────────
    // UPDATE
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_update_their_cycle(): void
    {
        $cycle = Cycle::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->putJson("/api/v1/cycles/{$cycle->id}", [
                'phase' => 'ovulation',
                'mood' => 'happy',
            ]);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Cycle updated successfully.']);
    }

    public function test_user_cannot_update_another_users_cycle(): void
    {
        $cycle = Cycle::factory()->create();

        $response = $this->withToken($this->token)
            ->putJson("/api/v1/cycles/{$cycle->id}", [
                'phase' => 'ovulation',
            ]);

        $response->assertForbidden();
    }

    // ──────────────────────────────────────────────────────────────
    // DESTROY
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_delete_their_cycle(): void
    {
        $cycle = Cycle::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)
            ->deleteJson("/api/v1/cycles/{$cycle->id}");

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Cycle deleted successfully.']);
        $this->assertDatabaseMissing('cycles', ['id' => $cycle->id]);
    }

    public function test_user_cannot_delete_another_users_cycle(): void
    {
        $cycle = Cycle::factory()->create();

        $response = $this->withToken($this->token)
            ->deleteJson("/api/v1/cycles/{$cycle->id}");

        $response->assertForbidden();
    }

    // ──────────────────────────────────────────────────────────────
    // AUTH
    // ──────────────────────────────────────────────────────────────

    public function test_unauthenticated_user_cannot_access_cycles(): void
    {
        $response = $this->getJson('/api/v1/cycles');
        $response->assertUnauthorized();
    }

    // ──────────────────────────────────────────────────────────────
    // RELATIONSHIPS
    // ──────────────────────────────────────────────────────────────

    public function test_cycle_belongs_to_user(): void
    {
        $cycle = Cycle::factory()->create(['user_id' => $this->user->id]);
        $this->assertInstanceOf(User::class, $cycle->user);
    }

    public function test_cycle_has_symptoms_relationship(): void
    {
        $cycle = Cycle::factory()->create(['user_id' => $this->user->id]);
        $symptoms = Symptom::factory()->count(3)->create();
        $cycle->symptoms()->attach($symptoms);

        $this->assertCount(3, $cycle->fresh()->symptoms);
    }
}

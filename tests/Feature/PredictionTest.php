<?php

namespace Tests\Feature;

use App\Models\Cycle;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PredictionTest extends TestCase
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

    public function test_predictions_generated_with_enough_cycles(): void
    {
        // Create 3 cycles with 28-day intervals
        Cycle::factory()->create([
            'user_id' => $this->user->id,
            'start_date' => '2026-01-01',
            'end_date' => '2026-01-06',
        ]);
        Cycle::factory()->create([
            'user_id' => $this->user->id,
            'start_date' => '2026-01-29',
            'end_date' => '2026-02-03',
        ]);
        Cycle::factory()->create([
            'user_id' => $this->user->id,
            'start_date' => '2026-02-26',
            'end_date' => '2026-03-03',
        ]);

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/predictions');

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Predictions generated successfully.']);
        $response->assertJsonCount(3, 'predictions');

        // Verify prediction types
        $types = collect($response->json('predictions'))->pluck('type')->toArray();
        $this->assertContains('period', $types);
        $this->assertContains('ovulation', $types);
        $this->assertContains('fertile_window', $types);
    }

    public function test_predictions_not_generated_with_one_cycle(): void
    {
        Cycle::factory()->create([
            'user_id' => $this->user->id,
            'start_date' => '2026-01-01',
            'end_date' => '2026-01-06',
        ]);

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/predictions');

        $response->assertOk();
        $response->assertJsonFragment([
            'message' => 'Not enough cycle data to generate predictions.',
        ]);
        $response->assertJsonCount(0, 'predictions');
    }

    public function test_predictions_not_generated_with_zero_cycles(): void
    {
        $response = $this->withToken($this->token)
            ->getJson('/api/v1/predictions');

        $response->assertOk();
        $response->assertJsonCount(0, 'predictions');
    }

    public function test_unauthenticated_user_cannot_access_predictions(): void
    {
        $response = $this->getJson('/api/v1/predictions');
        $response->assertUnauthorized();
    }
}

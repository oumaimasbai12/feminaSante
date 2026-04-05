<?php

namespace Tests\Feature;

use App\Models\Symptom;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SymptomTest extends TestCase
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

    public function test_user_can_list_symptoms(): void
    {
        Symptom::factory()->count(5)->create();

        $response = $this->withToken($this->token)
            ->getJson('/api/v1/symptoms');

        $response->assertOk();
        $response->assertJsonCount(5);
    }

    public function test_user_can_create_symptom(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/symptoms', [
                'nom' => 'Maux de tête',
                'category' => 'physical',
                'icon' => '🤕',
                'description' => 'Douleurs à la tête',
            ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Symptom created successfully.']);
        $this->assertDatabaseHas('symptoms', ['nom' => 'Maux de tête']);
    }

    public function test_create_symptom_fails_without_required_fields(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/symptoms', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['nom', 'category']);
    }

    public function test_create_symptom_fails_with_invalid_category(): void
    {
        $response = $this->withToken($this->token)
            ->postJson('/api/v1/symptoms', [
                'nom' => 'Test',
                'category' => 'invalid',
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('category');
    }

    public function test_unauthenticated_user_cannot_access_symptoms(): void
    {
        $response = $this->getJson('/api/v1/symptoms');
        $response->assertUnauthorized();
    }
}

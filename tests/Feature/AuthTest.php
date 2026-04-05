<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    // ──────────────────────────────────────────────────────────────
    // REGISTER
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'nom' => 'Sara Belmokhi',
            'email' => 'sara@example.com',
            'motDePasse' => 'password123',
            'motDePasse_confirmation' => 'password123',
        ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'User registered successfully.']);
        $response->assertJsonStructure(['message', 'user', 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'sara@example.com',
        ]);
    }

    public function test_register_fails_without_required_fields(): void
    {
        $response = $this->postJson('/api/v1/register', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['nom', 'email', 'motDePasse']);
    }

    public function test_register_fails_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'sara@example.com']);

        $response = $this->postJson('/api/v1/register', [
            'nom' => 'Sara',
            'email' => 'sara@example.com',
            'motDePasse' => 'password123',
            'motDePasse_confirmation' => 'password123',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('email');
    }

    public function test_register_fails_with_short_password(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'nom' => 'Sara',
            'email' => 'sara@example.com',
            'motDePasse' => '123',
            'motDePasse_confirmation' => '123',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('motDePasse');
    }

    public function test_register_fails_when_password_not_confirmed(): void
    {
        $response = $this->postJson('/api/v1/register', [
            'nom' => 'Sara',
            'email' => 'sara@example.com',
            'motDePasse' => 'password123',
            'motDePasse_confirmation' => 'different123',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('motDePasse');
    }

    // ──────────────────────────────────────────────────────────────
    // LOGIN
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'motDePasse' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => $user->email,
            'motDePasse' => 'password123',
        ]);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Login successful.']);
        $response->assertJsonStructure(['message', 'user', 'token']);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        $user = User::factory()->create([
            'motDePasse' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/login', [
            'email' => $user->email,
            'motDePasse' => 'wrongpassword',
        ]);

        $response->assertUnauthorized();
        $response->assertJsonFragment(['message' => 'Invalid credentials.']);
    }

    public function test_login_fails_with_nonexistent_email(): void
    {
        $response = $this->postJson('/api/v1/login', [
            'email' => 'nonexistent@example.com',
            'motDePasse' => 'password123',
        ]);

        $response->assertUnauthorized();
    }

    public function test_login_fails_without_required_fields(): void
    {
        $response = $this->postJson('/api/v1/login', []);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['email', 'motDePasse']);
    }

    // ──────────────────────────────────────────────────────────────
    // PROFILE
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_view_profile(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/v1/profile');

        $response->assertOk();
        $response->assertJsonFragment(['email' => $user->email]);
    }

    public function test_user_can_update_profile(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
            ->putJson('/api/v1/profile', [
                'nom' => 'Updated Name',
                'email' => $user->email,
            ]);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Profile updated successfully.']);
        $response->assertJsonPath('user.nom', 'Updated Name');
    }

    public function test_profile_update_fails_with_duplicate_email(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();
        $token = $userA->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
            ->putJson('/api/v1/profile', [
                'nom' => 'Sara',
                'email' => $userB->email,
            ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('email');
    }

    // ──────────────────────────────────────────────────────────────
    // LOGOUT
    // ──────────────────────────────────────────────────────────────

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/v1/logout');

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Logged out successfully.']);
    }

    public function test_unauthenticated_user_cannot_access_profile(): void
    {
        $response = $this->getJson('/api/v1/profile');
        $response->assertUnauthorized();
    }
}

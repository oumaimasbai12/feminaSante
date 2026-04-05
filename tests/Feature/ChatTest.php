<?php

namespace Tests\Feature;

use App\Models\Assistant\Chat;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatTest extends TestCase
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

    public function test_user_can_list_chats(): void
    {
        Chat::factory()->count(3)->create(['user_id' => $this->user->id]);
        Chat::factory()->create();

        $response = $this->withToken($this->token)->getJson('/api/v1/chats');
        $response->assertOk();
        $response->assertJsonCount(3);
    }

    public function test_user_can_create_chat_message(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/chats', [
            'message' => 'Comment fonctionne le cycle menstruel ?',
        ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Chat response generated successfully.']);
        $response->assertJsonStructure(['message', 'chat' => ['id', 'session_id', 'response', 'intent']]);
    }

    public function test_chat_detects_general_intent(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/chats', [
            'message' => 'Bonjour comment ça marche ?',
        ]);
        $response->assertCreated();
        $response->assertJsonPath('chat.intent', 'general');
        $response->assertJsonPath('chat.sentiment', 'neutral');
    }

    public function test_chat_detects_symptom_intent(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/chats', [
            'message' => 'J\'ai des douleurs au ventre.',
        ]);
        $response->assertCreated();
        $response->assertJsonPath('chat.intent', 'symptom_question');
    }

    public function test_chat_detects_urgent_intent(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/chats', [
            'message' => 'C\'est urgent j\'ai besoin d\'aide !',
        ]);
        $response->assertCreated();
        $response->assertJsonPath('chat.intent', 'urgent');
        $response->assertJsonPath('chat.sentiment', 'concerned');
    }

    public function test_chat_with_session_id(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/chats', [
            'message' => 'Test',
            'session_id' => 'sess-abc-123',
        ]);
        $response->assertCreated();
        $response->assertJsonPath('chat.session_id', 'sess-abc-123');
    }

    public function test_create_chat_fails_without_message(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/chats', []);
        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('message');
    }

    public function test_chat_belongs_to_user(): void
    {
        $chat = Chat::factory()->create(['user_id' => $this->user->id]);
        $this->assertInstanceOf(User::class, $chat->user);
    }

    public function test_unauthenticated_cannot_access_chats(): void
    {
        $this->getJson('/api/v1/chats')->assertUnauthorized();
    }
}

<?php

namespace Tests\Feature;

use App\Models\AppNotification;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
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

    public function test_user_can_list_own_notifications(): void
    {
        AppNotification::factory()->count(3)->create(['user_id' => $this->user->id]);
        AppNotification::factory()->create();

        $this->withToken($this->token)
            ->getJson('/api/v1/notifications')
            ->assertOk()
            ->assertJsonCount(3);
    }

    public function test_user_can_filter_unread_notifications(): void
    {
        AppNotification::factory()->create(['user_id' => $this->user->id, 'read_at' => null]);
        AppNotification::factory()->create(['user_id' => $this->user->id, 'read_at' => now()]);

        $this->withToken($this->token)
            ->getJson('/api/v1/notifications?read=0')
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_user_can_create_notification(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/notifications', [
            'type' => 'appointment',
            'title' => 'Rappel rendez-vous',
            'message' => 'Votre consultation commence dans 1 heure.',
            'data' => ['appointment_id' => 12],
        ]);

        $response->assertCreated()
            ->assertJsonFragment(['message' => 'Notification created successfully.']);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->user->id,
            'type' => 'appointment',
            'title' => 'Rappel rendez-vous',
        ]);
    }

    public function test_user_can_mark_notification_as_read(): void
    {
        $notification = AppNotification::factory()->create([
            'user_id' => $this->user->id,
            'read_at' => null,
        ]);

        $response = $this->withToken($this->token)
            ->patchJson("/api/v1/notifications/{$notification->id}", [
                'mark_as_read' => true,
            ]);

        $response->assertOk()
            ->assertJsonFragment(['message' => 'Notification updated successfully.']);

        $this->assertDatabaseMissing('notifications', [
            'id' => $notification->id,
            'read_at' => null,
        ]);
    }

    public function test_user_cannot_access_other_users_notification(): void
    {
        $notification = AppNotification::factory()->create();

        $this->withToken($this->token)
            ->getJson("/api/v1/notifications/{$notification->id}")
            ->assertForbidden();
    }

    public function test_user_can_delete_notification(): void
    {
        $notification = AppNotification::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $this->withToken($this->token)
            ->deleteJson("/api/v1/notifications/{$notification->id}")
            ->assertOk()
            ->assertJsonFragment(['message' => 'Notification deleted successfully.']);

        $this->assertDatabaseMissing('notifications', [
            'id' => $notification->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_access_notifications(): void
    {
        $this->getJson('/api/v1/notifications')->assertUnauthorized();
    }
}

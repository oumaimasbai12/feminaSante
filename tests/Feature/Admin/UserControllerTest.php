<?php

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_list_users()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(3)->create();

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/users');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data' => ['data' => [['id', 'nom', 'email', 'is_admin']]]]);
    }

    public function test_admin_can_view_user()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/users/' . $user->id);

        $response->assertStatus(200)
                 ->assertJsonFragment(['email' => $user->email]);
    }

    public function test_admin_can_delete_regular_user()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create(['is_admin' => false]);

        $response = $this->actingAs($admin)->deleteJson('/api/v1/admin/users/' . $user->id);

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_cannot_delete_another_admin()
    {
        $admin1 = User::factory()->create(['is_admin' => true]);
        $admin2 = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin1)->deleteJson('/api/v1/admin/users/' . $admin2->id);

        $response->assertStatus(403);
        $this->assertDatabaseHas('users', ['id' => $admin2->id]);
    }
}

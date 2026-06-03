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
                 ->assertJsonCount(3, 'data.data')
                 ->assertJsonStructure(['data' => ['data' => [['id', 'nom', 'email', 'is_admin']]]]);
    }

    public function test_admin_accounts_are_excluded_from_default_list()
    {
        $admin = User::factory()->create(['is_admin' => true, 'email' => 'admin@test.ma']);
        User::factory()->create(['email' => 'patient@test.ma']);

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/users');

        $response->assertOk();
        $emails = collect($response->json('data.data'))->pluck('email');
        $this->assertFalse($emails->contains('admin@test.ma'));
        $this->assertTrue($emails->contains('patient@test.ma'));
    }

    public function test_admin_can_view_user()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $user = User::factory()->create();

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/users/' . $user->id);

        $response->assertStatus(200)
                 ->assertJsonPath('data.user.email', $user->email)
                 ->assertJsonStructure([
                     'data' => [
                         'user',
                         'current_state',
                         'stats' => ['cycles_count', 'pregnancies_count', 'appointments_count', 'quiz_results_count'],
                         'health_overview',
                         'cycles',
                         'appointments',
                     ],
                 ]);
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

        $response->assertStatus(422);
        $this->assertDatabaseHas('users', ['id' => $admin2->id]);
    }
}

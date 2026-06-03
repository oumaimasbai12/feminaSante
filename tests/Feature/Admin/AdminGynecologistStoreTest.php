<?php

namespace Tests\Feature\Admin;

use App\Models\Appointments\Gynecologist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminGynecologistStoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_creates_gynecologist_with_login_account(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->postJson('/api/v1/admin/gynecologists', [
            'first_name' => 'Leila',
            'last_name' => 'Amrani',
            'email' => 'dr.leila@feminasante.ma',
            'adress' => '10 Rue Test',
            'city' => 'Casablanca',
        ]);

        $response->assertCreated()
            ->assertJsonPath('gynecologist.user_id', fn ($id) => $id > 0);

        $this->assertDatabaseHas('users', [
            'email' => 'dr.leila@feminasante.ma',
            'is_gynecologist' => true,
        ]);

        $gyn = Gynecologist::first();
        $this->assertNotNull($gyn->user_id);
        $this->assertFalse($gyn->is_active);
    }

    public function test_inactive_gynecologist_hidden_from_public_list(): void
    {
        Gynecologist::factory()->create(['is_active' => true]);
        Gynecologist::factory()->inactive()->create();

        $response = $this->getJson('/api/v1/gynecologists');

        $response->assertOk();
        $response->assertJsonCount(1);
    }

    public function test_inactive_gynecologist_not_visible_on_public_show(): void
    {
        $gyn = Gynecologist::factory()->inactive()->create();

        $this->getJson("/api/v1/gynecologists/{$gyn->id}")
            ->assertNotFound();
    }

    public function test_adding_availability_activates_gynecologist_profile(): void
    {
        $doctorUser = User::factory()->create(['is_gynecologist' => true]);
        $gyn = Gynecologist::factory()->create([
            'user_id' => $doctorUser->id,
            'is_active' => false,
        ]);
        $token = $doctorUser->createToken('test')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/v1/gynecologist/availabilities', [
                'date' => now()->addDay()->toDateString(),
                'start_time' => '09:00',
                'end_time' => '12:00',
            ])
            ->assertCreated()
            ->assertJsonPath('is_active', true);

        $this->assertTrue($gyn->fresh()->is_active);
        $this->getJson('/api/v1/gynecologists')->assertJsonCount(1);
    }

    public function test_gynecologists_are_excluded_from_users_list(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->create(['is_gynecologist' => true, 'email' => 'dr@test.ma']);
        User::factory()->create(['email' => 'patient@test.ma']);

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/users');

        $response->assertOk();
        $emails = collect($response->json('data.data'))->pluck('email');
        $this->assertFalse($emails->contains('dr@test.ma'));
        $this->assertTrue($emails->contains('patient@test.ma'));
    }
}

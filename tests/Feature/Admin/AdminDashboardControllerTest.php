<?php

namespace Tests\Feature\Admin;

use App\Models\Appointments\Appointment;
use App\Models\Appointments\Gynecologist;
use App\Models\User;
use App\Models\Cycle;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Menopause\Menopause;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_dashboard_statistics(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        User::factory()->count(2)->create();

        Cycle::factory()->count(3)->create(['user_id' => $admin->id]);
        Pregnancy::factory()->count(1)->create(['user_id' => $admin->id]);
        Menopause::factory()->count(2)->create(['user_id' => $admin->id]);

        $gyn = Gynecologist::factory()->create(['is_active' => true]);
        $patient = User::factory()->create();
        Appointment::factory()->count(3)->create([
            'user_id' => $patient->id,
            'gynecologist_id' => $gyn->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/dashboard');

        $response->assertOk()
            ->assertJsonPath('data.stats.total_users', User::count())
            ->assertJsonPath('data.stats.total_cycles_logged', 3)
            ->assertJsonPath('data.stats.total_pregnancies', 1)
            ->assertJsonPath('data.stats.total_menopauses', 2)
            ->assertJsonPath('data.stats.total_gynecologists', 1)
            ->assertJsonPath('data.stats.pending_appointments', 3)
            ->assertJsonStructure([
                'data' => [
                    'stats',
                    'recent_users',
                    'recent_appointments',
                ],
            ]);
    }
}

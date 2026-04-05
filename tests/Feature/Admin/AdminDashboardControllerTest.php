<?php

namespace Tests\Feature\Admin;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Cycle;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Menopause\Menopause;

class AdminDashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_returns_dashboard_statistics()
    {
        $admin = User::factory()->create(['is_admin' => true]);
        
        // Arrange (use raw creation if factories are unavailable or incomplete)
        User::factory()->count(2)->create();
        

        Cycle::factory()->count(3)->create(['user_id' => $admin->id]);
        Pregnancy::factory()->count(1)->create(['user_id' => $admin->id]);
        Menopause::factory()->count(2)->create(['user_id' => $admin->id]);

        $response = $this->actingAs($admin)->getJson('/api/v1/admin/dashboard');

        $response->assertStatus(200)
                 ->assertJson([
                     'message' => 'Dashboard statistics retrieved successfully.',
                     'data' => [
                         'total_users' => 3, // $admin + 2
                         'total_cycles_logged' => 3,
                         'total_pregnancies' => 1,
                         'total_menopauses' => 2,
                     ]
                 ]);
    }
}

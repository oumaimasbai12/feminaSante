<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Appointments\Gynecologist;
use App\Models\Appointments\Appointment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GynecologistPortalTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_gynecologist_cannot_access_dashboard()
    {
        $user = User::factory()->create(['is_gynecologist' => false]);
        $response = $this->actingAs($user)->get('/gynecologist/dashboard');
        $response->assertStatus(403);
    }

    public function test_gynecologist_can_access_dashboard()
    {
        $user = User::factory()->create(['is_gynecologist' => true]);
        $gynecologist = Gynecologist::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->get('/gynecologist/dashboard');
        $response->assertStatus(200);
    }

    public function test_gynecologist_can_update_own_appointment_status()
    {
        $user = User::factory()->create(['is_gynecologist' => true]);
        $gynecologist = Gynecologist::factory()->create(['user_id' => $user->id]);
        $patient = User::factory()->create();
        
        $appointment = Appointment::factory()->create([
            'gynecologist_id' => $gynecologist->id,
            'user_id' => $patient->id,
            'status' => 'pending'
        ]);

        $response = $this->actingAs($user)->putJson("/api/v1/gynecologist/appointments/{$appointment->id}/status", [
            'status' => 'confirmed'
        ]);

        $response->assertStatus(200);
        $this->assertEquals('confirmed', $appointment->fresh()->status);
    }

    public function test_gynecologist_cannot_update_other_appointment_status()
    {
        $user1 = User::factory()->create(['is_gynecologist' => true]);
        $gynecologist1 = Gynecologist::factory()->create(['user_id' => $user1->id]);

        $user2 = User::factory()->create(['is_gynecologist' => true]);
        $gynecologist2 = Gynecologist::factory()->create(['user_id' => $user2->id]);

        $patient = User::factory()->create();
        
        $appointment = Appointment::factory()->create([
            'gynecologist_id' => $gynecologist2->id,
            'user_id' => $patient->id,
            'status' => 'pending'
        ]);

        $response = $this->actingAs($user1)->putJson("/api/v1/gynecologist/appointments/{$appointment->id}/status", [
            'status' => 'confirmed'
        ]);

        $response->assertStatus(403);
        $this->assertEquals('pending', $appointment->fresh()->status);
    }
}

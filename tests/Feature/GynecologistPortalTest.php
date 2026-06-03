<?php

namespace Tests\Feature;

use App\Models\Appointments\Appointment;
use App\Models\Appointments\Availability;
use App\Models\Appointments\Gynecologist;
use App\Models\AppNotification;
use App\Models\Cycle;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GynecologistPortalTest extends TestCase
{
    use RefreshDatabase;

    private User $doctorUser;

    private Gynecologist $gynecologist;

    private User $patient;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->doctorUser = User::factory()->create(['is_gynecologist' => true]);
        $this->gynecologist = Gynecologist::factory()->create(['user_id' => $this->doctorUser->id, 'is_active' => true]);

        Availability::factory()->create([
            'gynecologist_id' => $this->gynecologist->id,
            'date' => Carbon::tomorrow()->toDateString(),
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
            'is_available' => true,
        ]);
        $this->patient = User::factory()->create();
        $this->token = $this->doctorUser->createToken('test')->plainTextToken;

        Appointment::factory()->create([
            'user_id' => $this->patient->id,
            'gynecologist_id' => $this->gynecologist->id,
            'status' => 'pending',
            'start_time' => Carbon::tomorrow()->setTime(10, 0),
            'end_time' => Carbon::tomorrow()->setTime(10, 30),
        ]);
    }

    public function test_doctor_can_confirm_appointment(): void
    {
        $appointment = Appointment::first();

        $this->withToken($this->token)
            ->putJson("/api/v1/gynecologist/appointments/{$appointment->id}/confirm")
            ->assertOk()
            ->assertJsonPath('appointment.status', 'confirmed');
    }

    public function test_doctor_cannot_view_unrelated_patient_file(): void
    {
        $stranger = User::factory()->create();

        $this->withToken($this->token)
            ->getJson("/api/v1/gynecologist/patients/{$stranger->id}/file")
            ->assertUnprocessable();
    }

    public function test_doctor_can_view_patient_file_with_medical_summary(): void
    {
        Cycle::factory()->create(['user_id' => $this->patient->id]);

        $this->withToken($this->token)
            ->getJson("/api/v1/gynecologist/patients/{$this->patient->id}/file")
            ->assertOk()
            ->assertJsonStructure(['patient', 'current_state', 'cycle', 'symptom_timeline', 'clinical_notes']);
    }

    public function test_doctor_can_manage_own_availabilities(): void
    {
        $date = Carbon::tomorrow()->toDateString();
        $date2 = Carbon::tomorrow()->addDays(2)->toDateString();
        $date3 = Carbon::tomorrow()->addDays(3)->toDateString();

        $this->withToken($this->token)
            ->postJson('/api/v1/gynecologist/availabilities', [
                'date' => $date,
                'start_time' => '14:00',
                'end_time' => '17:00',
            ])
            ->assertCreated();

        $this->withToken($this->token)
            ->postJson('/api/v1/gynecologist/availabilities', [
                'dates' => [$date2, $date3],
                'start_time' => '09:00',
                'end_time' => '12:00',
            ])
            ->assertCreated()
            ->assertJsonPath('count', 2);

        $this->assertTrue($this->gynecologist->fresh()->is_active);

        $this->withToken($this->token)
            ->getJson('/api/v1/gynecologist/availabilities')
            ->assertOk()
            ->assertJsonCount(4);
    }

    public function test_complete_appointment_prompts_clinical_note(): void
    {
        $appointment = Appointment::first();
        $appointment->update(['status' => 'confirmed']);

        $this->withToken($this->token)
            ->putJson("/api/v1/gynecologist/appointments/{$appointment->id}/complete")
            ->assertOk()
            ->assertJsonPath('requires_clinical_note', true);
    }

    public function test_doctor_can_list_patients(): void
    {
        $this->withToken($this->token)
            ->getJson('/api/v1/gynecologist/patients')
            ->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.nom', $this->patient->nom);
    }

    public function test_doctor_can_share_visit_summary_with_patient(): void
    {
        $appointment = Appointment::first();
        $appointment->update(['status' => 'completed']);

        $this->withToken($this->token)
            ->postJson('/api/v1/gynecologist/clinical-notes', [
                'user_id' => $this->patient->id,
                'appointment_id' => $appointment->id,
                'patient_summary' => 'Repos recommandé, contrôle dans 3 mois.',
                'prescription' => 'Vitamine D',
            ])
            ->assertCreated()
            ->assertJsonPath('clinical_note.shared_with_patient', true);

        $this->assertDatabaseHas('clinical_notes', [
            'appointment_id' => $appointment->id,
            'patient_summary' => 'Repos recommandé, contrôle dans 3 mois.',
            'shared_with_patient' => 1,
        ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->patient->id,
            'type' => 'visit_summary',
        ]);

        $this->assertDatabaseHas('appointements', [
            'user_id' => $this->patient->id,
            'id' => $appointment->id,
        ]);

        $this->assertSame($this->patient->id, Appointment::first()->user_id);

        $response = $this->actingAs($this->patient, 'sanctum')->getJson('/api/v1/appointments');
        $response->assertOk();
        $json = $response->json();
        $this->assertCount(1, $json, 'Expected 1 appointment, got: '.json_encode($json));
        $this->assertSame('Repos recommandé, contrôle dans 3 mois.', $json[0]['visit_summary']['patient_summary'] ?? null);
    }

    public function test_refusal_notifies_patient_with_reason(): void
    {
        $appointment = Appointment::first();

        $this->withToken($this->token)
            ->putJson("/api/v1/gynecologist/appointments/{$appointment->id}/refuse", [
                'reason' => 'Congés cette semaine',
            ])
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->patient->id,
            'type' => 'appointment_cancelled',
        ]);

        $notification = AppNotification::where('user_id', $this->patient->id)->latest('id')->first();
        $this->assertStringContainsString('Congés cette semaine', $notification->message);
    }
}

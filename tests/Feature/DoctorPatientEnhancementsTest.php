<?php

namespace Tests\Feature;

use App\Models\Appointments\Appointment;
use App\Models\Appointments\Availability;
use App\Models\Appointments\ConsultationMessage;
use App\Models\Appointments\Gynecologist;
use App\Models\AppNotification;
use App\Models\User;
use App\Services\AppointmentReminderService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorPatientEnhancementsTest extends TestCase
{
    use RefreshDatabase;

    private User $doctorUser;

    private Gynecologist $gynecologist;

    private User $patient;

    private string $doctorToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->doctorUser = User::factory()->create(['is_gynecologist' => true]);
        $this->gynecologist = Gynecologist::factory()->create(['user_id' => $this->doctorUser->id, 'is_active' => true]);
        $this->patient = User::factory()->create();
        $this->doctorToken = $this->doctorUser->createToken('test')->plainTextToken;

        Availability::factory()->create([
            'gynecologist_id' => $this->gynecologist->id,
            'date' => Carbon::tomorrow()->toDateString(),
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
        ]);
    }

    public function test_patient_can_save_preparation_notes(): void
    {
        $appointment = Appointment::factory()->create([
            'user_id' => $this->patient->id,
            'gynecologist_id' => $this->gynecologist->id,
            'status' => 'confirmed',
            'start_time' => Carbon::tomorrow()->setTime(10, 0),
            'end_time' => Carbon::tomorrow()->setTime(10, 30),
        ]);

        $this->actingAs($this->patient, 'sanctum')
            ->putJson("/api/v1/appointments/{$appointment->id}/preparation", [
                'patient_preparation' => 'Douleurs depuis 2 semaines, question contraception.',
            ])
            ->assertOk();

        $this->assertDatabaseHas('appointements', [
            'id' => $appointment->id,
            'patient_preparation' => 'Douleurs depuis 2 semaines, question contraception.',
        ]);
    }

    public function test_consultation_messages_between_doctor_and_patient(): void
    {
        Appointment::factory()->create([
            'user_id' => $this->patient->id,
            'gynecologist_id' => $this->gynecologist->id,
            'status' => 'confirmed',
        ]);

        $this->withToken($this->doctorToken)
            ->postJson("/api/v1/gynecologist/patients/{$this->patient->id}/messages", [
                'body' => 'Bonjour, pensez à apporter vos derniers examens.',
            ])
            ->assertCreated();

        $this->actingAs($this->patient, 'sanctum')
            ->getJson("/api/v1/gynecologists/{$this->gynecologist->id}/messages")
            ->assertOk()
            ->assertJsonCount(1);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->patient->id,
            'type' => 'consultation_message',
        ]);
    }

    public function test_patient_cannot_message_doctor_before_appointment_confirmed(): void
    {
        Appointment::factory()->create([
            'user_id' => $this->patient->id,
            'gynecologist_id' => $this->gynecologist->id,
            'status' => 'pending',
        ]);

        $this->actingAs($this->patient, 'sanctum')
            ->getJson("/api/v1/gynecologists/{$this->gynecologist->id}/messages")
            ->assertStatus(422)
            ->assertJsonValidationErrors(['gynecologist']);

        $this->actingAs($this->patient, 'sanctum')
            ->postJson("/api/v1/gynecologists/{$this->gynecologist->id}/messages", [
                'body' => 'Bonjour docteur',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['gynecologist']);
    }

    public function test_complete_with_follow_up_sends_notification(): void
    {
        $appointment = Appointment::factory()->create([
            'user_id' => $this->patient->id,
            'gynecologist_id' => $this->gynecologist->id,
            'status' => 'confirmed',
            'start_time' => Carbon::tomorrow()->setTime(10, 0),
            'end_time' => Carbon::tomorrow()->setTime(10, 30),
        ]);

        $this->withToken($this->doctorToken)
            ->putJson("/api/v1/gynecologist/appointments/{$appointment->id}/complete", [
                'follow_up_weeks' => 12,
            ])
            ->assertOk();

        $this->assertDatabaseHas('notifications', [
            'user_id' => $this->patient->id,
            'type' => 'follow_up_suggested',
        ]);
    }

    public function test_appointment_reminder_service_sends_notifications(): void
    {
        $start = Carbon::now()->addHours(24);
        Appointment::factory()->create([
            'user_id' => $this->patient->id,
            'gynecologist_id' => $this->gynecologist->id,
            'status' => 'confirmed',
            'start_time' => $start,
            'end_time' => $start->copy()->addMinutes(30),
        ]);

        $count = app(AppointmentReminderService::class)->sendDueReminders();

        $this->assertGreaterThanOrEqual(1, $count);
        $this->assertTrue(
            AppNotification::where('type', 'appointment_reminder')->exists()
        );
    }
}

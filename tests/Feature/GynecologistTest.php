<?php

namespace Tests\Feature;

use App\Models\Appointments\Appointment;
use App\Models\Appointments\Availability;
use App\Models\Appointments\Gynecologist;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GynecologistTest extends TestCase
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

    public function test_user_can_list_active_gynecologists(): void
    {
        Gynecologist::factory()->count(2)->create(['is_active' => true]);
        Gynecologist::factory()->inactive()->create();

        $response = $this->withToken($this->token)->getJson('/api/v1/gynecologists');
        $response->assertOk();
        $response->assertJsonCount(2);
    }

    public function test_filter_gynecologists_by_city(): void
    {
        Gynecologist::factory()->create(['city' => 'Rabat', 'is_active' => true]);
        Gynecologist::factory()->create(['city' => 'Casablanca', 'is_active' => true]);

        $response = $this->withToken($this->token)->getJson('/api/v1/gynecologists?city=Rabat');
        $response->assertOk();
        $response->assertJsonCount(1);
    }

    public function test_user_can_create_gynecologist(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/gynecologists', [
            'first_name' => 'Fatima',
            'last_name' => 'Zahra',
            'adress' => '12 Rue Mohamed V',
            'city' => 'Rabat',
            'phone' => '0600000000',
        ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Gynecologist created successfully.']);
    }

    public function test_create_gynecologist_fails_without_required(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/gynecologists', []);
        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['first_name', 'last_name', 'adress', 'city']);
    }

    public function test_show_gynecologist_with_availabilities(): void
    {
        $gyno = Gynecologist::factory()->create();
        Availability::factory()->count(2)->create(['gynecologist_id' => $gyno->id]);

        $response = $this->withToken($this->token)->getJson("/api/v1/gynecologists/{$gyno->id}");
        $response->assertOk();
        $response->assertJsonCount(2, 'availabilities');
    }

    // AVAILABILITIES
    public function test_user_can_list_availabilities(): void
    {
        Availability::factory()->count(3)->create(['is_available' => true]);
        Availability::factory()->unavailable()->create();

        $response = $this->withToken($this->token)->getJson('/api/v1/availabilities');
        $response->assertOk();
        $response->assertJsonCount(3);
    }

    public function test_user_can_create_availability(): void
    {
        $gyno = Gynecologist::factory()->create();

        $response = $this->withToken($this->token)->postJson('/api/v1/availabilities', [
            'gynecologist_id' => $gyno->id,
            'date' => '2026-04-15',
            'start_time' => '09:00',
            'end_time' => '17:00',
            'recurrence' => 'weekly',
        ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Availability created successfully.']);
    }

    public function test_create_availability_fails_without_required(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/availabilities', []);
        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['gynecologist_id', 'date', 'start_time', 'end_time']);
    }

    // APPOINTMENTS
    public function test_user_can_list_appointments(): void
    {
        Appointment::factory()->count(2)->create(['user_id' => $this->user->id]);
        Appointment::factory()->create();

        $response = $this->withToken($this->token)->getJson('/api/v1/appointments');
        $response->assertOk();
        $response->assertJsonCount(2);
    }

    public function test_user_can_book_appointment(): void
    {
        $gyno = Gynecologist::factory()->create();

        $response = $this->withToken($this->token)->postJson('/api/v1/appointments', [
            'gynecologist_id' => $gyno->id,
            'start_time' => '2026-04-15 10:00:00',
            'end_time' => '2026-04-15 10:30:00',
            'consultation_type' => 'cabinet',
            'reason' => 'Consultation annuelle',
            'is_first_visit' => true,
        ]);

        $response->assertCreated();
        $response->assertJsonFragment(['message' => 'Appointment booked successfully.']);
        $response->assertJsonPath('appointment.status', 'pending');
    }

    public function test_cannot_double_book_same_slot(): void
    {
        $gyno = Gynecologist::factory()->create();
        Appointment::factory()->create([
            'gynecologist_id' => $gyno->id,
            'start_time' => '2026-04-15 10:00:00',
            'end_time' => '2026-04-15 10:30:00',
            'status' => 'confirmed',
        ]);

        $response = $this->withToken($this->token)->postJson('/api/v1/appointments', [
            'gynecologist_id' => $gyno->id,
            'start_time' => '2026-04-15 10:00:00',
            'end_time' => '2026-04-15 10:30:00',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonFragment(['message' => 'This slot is already booked.']);
    }

    public function test_create_appointment_fails_without_required(): void
    {
        $response = $this->withToken($this->token)->postJson('/api/v1/appointments', []);
        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['gynecologist_id', 'start_time', 'end_time']);
    }

    public function test_user_can_show_their_appointment(): void
    {
        $appt = Appointment::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)->getJson("/api/v1/appointments/{$appt->id}");
        $response->assertOk();
        $response->assertJsonPath('id', $appt->id);
    }

    public function test_user_cannot_show_other_users_appointment(): void
    {
        $appt = Appointment::factory()->create();

        $response = $this->withToken($this->token)->getJson("/api/v1/appointments/{$appt->id}");
        $response->assertForbidden();
    }

    public function test_user_can_update_appointment(): void
    {
        $appt = Appointment::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withToken($this->token)->putJson("/api/v1/appointments/{$appt->id}", [
            'status' => 'cancelled',
            'cancellation_reason' => 'Empêchement',
        ]);

        $response->assertOk();
        $response->assertJsonFragment(['message' => 'Appointment updated successfully.']);
    }

    public function test_user_cannot_update_other_users_appointment(): void
    {
        $appt = Appointment::factory()->create();

        $response = $this->withToken($this->token)->putJson("/api/v1/appointments/{$appt->id}", [
            'status' => 'cancelled',
        ]);

        $response->assertForbidden();
    }

    // RELATIONSHIPS
    public function test_gynecologist_has_many_availabilities(): void
    {
        $gyno = Gynecologist::factory()->create();
        Availability::factory()->count(3)->create(['gynecologist_id' => $gyno->id]);
        $this->assertCount(3, $gyno->availabilities);
    }

    public function test_gynecologist_has_many_appointments(): void
    {
        $gyno = Gynecologist::factory()->create();
        Appointment::factory()->count(2)->create(['gynecologist_id' => $gyno->id]);
        $this->assertCount(2, $gyno->appointments);
    }

    public function test_appointment_belongs_to_user_and_gynecologist(): void
    {
        $appt = Appointment::factory()->create(['user_id' => $this->user->id]);
        $this->assertInstanceOf(User::class, $appt->user);
        $this->assertInstanceOf(Gynecologist::class, $appt->gynecologist);
    }

    public function test_unauthenticated_user_cannot_access(): void
    {
        $this->getJson('/api/v1/gynecologists')->assertUnauthorized();
        $this->getJson('/api/v1/availabilities')->assertUnauthorized();
        $this->getJson('/api/v1/appointments')->assertUnauthorized();
    }
}

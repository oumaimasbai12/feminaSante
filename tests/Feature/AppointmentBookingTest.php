<?php

namespace Tests\Feature;

use App\Events\AppointmentRequested;
use App\Models\Appointments\Appointment;
use App\Models\Appointments\Availability;
use App\Models\Appointments\Gynecologist;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class AppointmentBookingTest extends TestCase
{
    use RefreshDatabase;

    private User $patient;

    private Gynecologist $doctor;

    private string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->patient = User::factory()->create();
        $this->token = $this->patient->createToken('test')->plainTextToken;

        $this->doctor = Gynecologist::factory()->create([
            'is_active' => true,
            'consultation_duration' => 30,
        ]);

        Availability::factory()->create([
            'gynecologist_id' => $this->doctor->id,
            'date' => Carbon::tomorrow()->toDateString(),
            'start_time' => '09:00:00',
            'end_time' => '12:00:00',
            'is_available' => true,
        ]);
    }

    public function test_gynecologist_filters_endpoint_returns_cities_and_specialities(): void
    {
        Gynecologist::factory()->create(['city' => 'Marrakech', 'speciality' => 'Endocrinologie', 'is_active' => true]);

        $response = $this->getJson('/api/v1/gynecologists/filters');

        $response->assertOk();
        $response->assertJsonStructure(['cities', 'specialities', 'common_reasons']);
    }

    public function test_gynecologist_index_filters_by_city_and_speciality_scopes(): void
    {
        Gynecologist::factory()->create(['city' => 'Fès', 'speciality' => 'Obstétrique', 'is_active' => true]);
        Gynecologist::factory()->create(['city' => 'Tanger', 'speciality' => 'Gynécologie médicale', 'is_active' => true]);

        $this->getJson('/api/v1/gynecologists?city=Fès')
            ->assertOk()
            ->assertJsonCount(1);

        $this->getJson('/api/v1/gynecologists?speciality=Obstétrique')
            ->assertOk()
            ->assertJsonCount(1);
    }

    public function test_available_slots_excludes_booked_times(): void
    {
        $date = Carbon::tomorrow()->toDateString();
        $start = Carbon::parse($date.' 09:00:00');
        $end = Carbon::parse($date.' 09:30:00');

        Appointment::factory()->create([
            'user_id' => User::factory()->create()->id,
            'gynecologist_id' => $this->doctor->id,
            'start_time' => $start,
            'end_time' => $end,
            'status' => 'pending',
        ]);

        $response = $this->getJson("/api/v1/gynecologists/{$this->doctor->id}/slots?date={$date}");

        $response->assertOk();
        $slots = collect($response->json('slots'));
        $this->assertFalse($slots->contains(fn ($s) => str_contains($s['start_time'], '09:00')));
    }

    public function test_availability_summary_returns_upcoming_bookable_days(): void
    {
        $response = $this->getJson("/api/v1/gynecologists/{$this->doctor->id}/availability");

        $response->assertOk();
        $response->assertJsonPath('has_availability', true);
        $response->assertJsonStructure([
            'gynecologist_id',
            'has_availability',
            'days' => [
                ['date', 'label', 'slots_count', 'windows' => [['start', 'end']]],
            ],
        ]);

        $days = collect($response->json('days'));
        $this->assertTrue($days->contains('date', Carbon::tomorrow()->toDateString()));
        $this->assertGreaterThan(0, $days->first()['slots_count']);
    }

    public function test_booking_dispatches_event_and_prevents_overlap(): void
    {
        Event::fake([AppointmentRequested::class]);

        $date = Carbon::tomorrow()->toDateString();
        $payload = [
            'gynecologist_id' => $this->doctor->id,
            'start_time' => Carbon::parse($date.' 10:00:00')->toIso8601String(),
            'end_time' => Carbon::parse($date.' 10:30:00')->toIso8601String(),
            'reason' => 'Consultation annuelle',
            'notes' => 'Première visite',
        ];

        $first = $this->withToken($this->token)->postJson('/api/v1/appointments', $payload);
        $first->assertCreated();
        Event::assertDispatched(AppointmentRequested::class);

        $other = User::factory()->create();
        $second = $this->withToken($other->createToken('test')->plainTextToken)
            ->postJson('/api/v1/appointments', $payload);

        $second->assertUnprocessable();
        $second->assertJsonValidationErrors('start_time');
    }

    public function test_booking_rejects_slot_outside_availability(): void
    {
        $date = Carbon::tomorrow()->toDateString();

        $response = $this->withToken($this->token)->postJson('/api/v1/appointments', [
            'gynecologist_id' => $this->doctor->id,
            'start_time' => Carbon::parse($date.' 18:00:00')->toIso8601String(),
            'end_time' => Carbon::parse($date.' 18:30:00')->toIso8601String(),
            'reason' => 'Douleurs pelviennes',
        ]);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors('start_time');
    }
}

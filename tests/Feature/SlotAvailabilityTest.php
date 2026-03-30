<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\Specialization;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SlotAvailabilityTest extends TestCase
{
    use RefreshDatabase;

    private User $doctor;

    protected function setUp(): void
    {
        parent::setUp();

        $specialization = Specialization::factory()->create();
        $this->doctor = User::factory()->doctor()->create();
        $this->doctor->doctorProfile()->create([
            'specialization_id' => $specialization->id,
            'experience_years' => 5,
            'rating_avg' => 0,
        ]);

        Schedule::factory()->create([
            'doctor_id' => $this->doctor->id,
            'day_of_week' => 1, // Monday
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'is_active' => true,
        ]);
    }

    private function nextMonday(): Carbon
    {
        return Carbon::now()->next('Monday');
    }

    public function test_returns_slots_for_doctor_with_schedule(): void
    {
        $date = $this->nextMonday()->format('Y-m-d');

        $response = $this->getJson("/api/v1/doctors/{$this->doctor->id}/slots?date={$date}")
            ->assertOk();

        // 09:00–11:00 with 30min slots = 4 slots
        $this->assertCount(4, $response->json('data'));
    }

    public function test_booked_slot_is_marked_unavailable(): void
    {
        $monday = $this->nextMonday();
        $startTime = $monday->copy()->setTime(9, 0);

        Appointment::factory()->create([
            'doctor_id' => $this->doctor->id,
            'start_time' => $startTime,
            'end_time' => $startTime->copy()->addMinutes(30),
            'status' => AppointmentStatus::Confirmed,
        ]);

        $response = $this->getJson("/api/v1/doctors/{$this->doctor->id}/slots?date={$monday->format('Y-m-d')}")
            ->assertOk();

        $slots = $response->json('data');
        $bookedSlot = collect($slots)->first(fn ($s) => str_contains($s['start_time'], '09:00'));

        $this->assertFalse($bookedSlot['is_available']);
    }

    public function test_cancelled_appointment_frees_slot(): void
    {
        $monday = $this->nextMonday();
        $startTime = $monday->copy()->setTime(9, 0);

        Appointment::factory()->cancelled()->create([
            'doctor_id' => $this->doctor->id,
            'start_time' => $startTime,
            'end_time' => $startTime->copy()->addMinutes(30),
        ]);

        $response = $this->getJson("/api/v1/doctors/{$this->doctor->id}/slots?date={$monday->format('Y-m-d')}")
            ->assertOk();

        $slots = $response->json('data');
        $slot = collect($slots)->first(fn ($s) => str_contains($s['start_time'], '09:00'));

        $this->assertTrue($slot['is_available']);
    }

    public function test_returns_empty_for_day_without_schedule(): void
    {
        // Tuesday — no schedule set
        $tuesday = Carbon::now()->next('Tuesday')->format('Y-m-d');

        $response = $this->getJson("/api/v1/doctors/{$this->doctor->id}/slots?date={$tuesday}")
            ->assertOk();

        $this->assertEmpty($response->json('data'));
    }

    public function test_date_is_required(): void
    {
        $this->getJson("/api/v1/doctors/{$this->doctor->id}/slots")
            ->assertStatus(422)
            ->assertJsonValidationErrors('date');
    }
}

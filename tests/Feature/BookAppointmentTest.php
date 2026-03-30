<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\Specialization;
use App\Models\User;
use App\Notifications\AppointmentCreatedNotification;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class BookAppointmentTest extends TestCase
{
    use RefreshDatabase;

    private User $doctor;

    private User $patient;

    protected function setUp(): void
    {
        parent::setUp();

        Notification::fake();

        $specialization = Specialization::factory()->create();
        $this->doctor = User::factory()->doctor()->create();
        $this->doctor->doctorProfile()->create([
            'specialization_id' => $specialization->id,
            'experience_years' => 5,
            'rating_avg' => 0,
        ]);

        // Monday schedule 09:00–17:00
        Schedule::factory()->create([
            'doctor_id' => $this->doctor->id,
            'day_of_week' => 1,
            'start_time' => '09:00:00',
            'end_time' => '17:00:00',
            'is_active' => true,
        ]);

        $this->patient = User::factory()->patient()->create();
    }

    private function nextMonday(string $time = '09:00'): string
    {
        return Carbon::now()->next('Monday')->format("Y-m-d {$time}:00");
    }

    public function test_patient_can_book_available_slot(): void
    {
        $response = $this->actingAs($this->patient)
            ->postJson('/api/v1/appointments', [
                'doctor_id' => $this->doctor->id,
                'start_time' => $this->nextMonday('09:00'),
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.status', 'pending')
            ->assertJsonPath('data.doctor.id', $this->doctor->id);

        $this->assertDatabaseHas('appointments', [
            'doctor_id' => $this->doctor->id,
            'patient_id' => $this->patient->id,
            'status' => AppointmentStatus::Pending->value,
        ]);
    }

    public function test_booking_sends_notifications(): void
    {
        $this->actingAs($this->patient)
            ->postJson('/api/v1/appointments', [
                'doctor_id' => $this->doctor->id,
                'start_time' => $this->nextMonday('09:00'),
            ]);

        Notification::assertSentTo($this->doctor, AppointmentCreatedNotification::class);
        Notification::assertSentTo($this->patient, AppointmentCreatedNotification::class);
    }

    public function test_cannot_book_slot_in_the_past(): void
    {
        $this->actingAs($this->patient)
            ->postJson('/api/v1/appointments', [
                'doctor_id' => $this->doctor->id,
                'start_time' => now()->subDay()->toDateTimeString(),
            ])->assertStatus(422)->assertJsonValidationErrors('start_time');
    }

    public function test_cannot_book_conflicting_slot(): void
    {
        $startTime = $this->nextMonday('09:00');

        Appointment::factory()->create([
            'doctor_id' => $this->doctor->id,
            'start_time' => $startTime,
            'end_time' => Carbon::parse($startTime)->addMinutes(30),
            'status' => AppointmentStatus::Confirmed,
        ]);

        $this->actingAs($this->patient)
            ->postJson('/api/v1/appointments', [
                'doctor_id' => $this->doctor->id,
                'start_time' => $startTime,
            ])->assertStatus(422);
    }

    public function test_cancelled_slot_can_be_rebooked(): void
    {
        $startTime = $this->nextMonday('10:00');

        Appointment::factory()->cancelled()->create([
            'doctor_id' => $this->doctor->id,
            'start_time' => $startTime,
            'end_time' => Carbon::parse($startTime)->addMinutes(30),
        ]);

        $this->actingAs($this->patient)
            ->postJson('/api/v1/appointments', [
                'doctor_id' => $this->doctor->id,
                'start_time' => $startTime,
            ])->assertStatus(201);
    }

    public function test_booking_requires_doctor_id_and_start_time(): void
    {
        $this->actingAs($this->patient)
            ->postJson('/api/v1/appointments', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['doctor_id', 'start_time']);
    }
}

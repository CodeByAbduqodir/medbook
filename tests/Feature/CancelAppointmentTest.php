<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\User;
use App\Notifications\AppointmentCancelledNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class CancelAppointmentTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
    }

    public function test_patient_can_cancel_own_pending_appointment(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->pending()->create(['patient_id' => $patient->id]);

        $this->actingAs($patient)
            ->patchJson("/api/v1/appointments/{$appointment->id}/cancel")
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');

        $this->assertDatabaseHas('appointments', [
            'id' => $appointment->id,
            'status' => AppointmentStatus::Cancelled->value,
            'cancelled_by' => $patient->id,
        ]);
    }

    public function test_patient_can_cancel_own_confirmed_appointment(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->confirmed()->create(['patient_id' => $patient->id]);

        $this->actingAs($patient)
            ->patchJson("/api/v1/appointments/{$appointment->id}/cancel")
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');
    }

    public function test_doctor_can_cancel_their_appointment(): void
    {
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->pending()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->patchJson("/api/v1/doctor/appointments/{$appointment->id}/cancel")
            ->assertOk()
            ->assertJsonPath('data.status', 'cancelled');
    }

    public function test_patient_cannot_cancel_another_patients_appointment(): void
    {
        $patient = User::factory()->patient()->create();
        $otherAppointment = Appointment::factory()->pending()->create();

        $this->actingAs($patient)
            ->patchJson("/api/v1/appointments/{$otherAppointment->id}/cancel")
            ->assertForbidden();
    }

    public function test_completed_appointment_cannot_be_cancelled(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->completed()->create(['patient_id' => $patient->id]);

        $this->actingAs($patient)
            ->patchJson("/api/v1/appointments/{$appointment->id}/cancel")
            ->assertForbidden();
    }

    public function test_cancel_sends_notifications_to_both_parties(): void
    {
        $patient = User::factory()->patient()->create();
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->pending()->create([
            'patient_id' => $patient->id,
            'doctor_id' => $doctor->id,
        ]);

        $this->actingAs($patient)
            ->patchJson("/api/v1/appointments/{$appointment->id}/cancel");

        Notification::assertSentTo($patient, AppointmentCancelledNotification::class);
        Notification::assertSentTo($doctor, AppointmentCancelledNotification::class);
    }
}

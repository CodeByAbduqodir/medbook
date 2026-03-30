<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\User;
use App\Notifications\AppointmentCompletedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class AppointmentStatusFlowTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Notification::fake();
    }

    public function test_doctor_can_confirm_pending_appointment(): void
    {
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->pending()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->patchJson("/api/v1/doctor/appointments/{$appointment->id}/confirm")
            ->assertOk()
            ->assertJsonPath('data.status', 'confirmed');
    }

    public function test_doctor_can_complete_confirmed_appointment(): void
    {
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->confirmed()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->patchJson("/api/v1/doctor/appointments/{$appointment->id}/complete", [
                'diagnosis' => 'Mild flu, rest and fluids recommended.',
            ])
            ->assertOk()
            ->assertJsonPath('data.status', 'completed')
            ->assertJsonPath('data.diagnosis', 'Mild flu, rest and fluids recommended.');
    }

    public function test_cannot_confirm_already_confirmed_appointment(): void
    {
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->confirmed()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->patchJson("/api/v1/doctor/appointments/{$appointment->id}/confirm")
            ->assertForbidden();
    }

    public function test_cannot_complete_pending_appointment(): void
    {
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->pending()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->patchJson("/api/v1/doctor/appointments/{$appointment->id}/complete", [
                'diagnosis' => 'Some diagnosis',
            ])->assertForbidden();
    }

    public function test_doctor_cannot_manage_another_doctors_appointments(): void
    {
        $doctor = User::factory()->doctor()->create();
        $otherAppointment = Appointment::factory()->pending()->create();

        $this->actingAs($doctor)
            ->patchJson("/api/v1/doctor/appointments/{$otherAppointment->id}/confirm")
            ->assertForbidden();
    }

    public function test_complete_sends_notification_to_patient(): void
    {
        $doctor = User::factory()->doctor()->create();
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->confirmed()->create([
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
        ]);

        $this->actingAs($doctor)
            ->patchJson("/api/v1/doctor/appointments/{$appointment->id}/complete", [
                'diagnosis' => 'All good.',
            ]);

        Notification::assertSentTo($patient, AppointmentCompletedNotification::class);
    }

    public function test_complete_requires_diagnosis(): void
    {
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->confirmed()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->patchJson("/api/v1/doctor/appointments/{$appointment->id}/complete", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors('diagnosis');
    }
}

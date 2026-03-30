<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_cannot_access_doctor_routes(): void
    {
        $patient = User::factory()->patient()->create();

        $this->actingAs($patient)
            ->getJson('/api/v1/doctor/appointments')
            ->assertForbidden();
    }

    public function test_doctor_cannot_book_appointment(): void
    {
        $doctor = User::factory()->doctor()->create();

        $this->actingAs($doctor)
            ->postJson('/api/v1/appointments', [])
            ->assertForbidden();
    }

    public function test_patient_cannot_access_doctor_schedule_endpoint(): void
    {
        $patient = User::factory()->patient()->create();

        $this->actingAs($patient)
            ->getJson('/api/v1/doctor/schedule')
            ->assertForbidden();
    }

    public function test_patient_cannot_confirm_appointment(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->pending()->create();

        $this->actingAs($patient)
            ->patchJson("/api/v1/doctor/appointments/{$appointment->id}/confirm")
            ->assertForbidden();
    }

    public function test_doctor_cannot_access_patient_prescription_list(): void
    {
        $doctor = User::factory()->doctor()->create();

        $this->actingAs($doctor)
            ->getJson('/api/v1/prescriptions')
            ->assertForbidden();
    }

    public function test_unauthenticated_cannot_access_patient_routes(): void
    {
        $this->getJson('/api/v1/appointments')->assertUnauthorized();
        $this->getJson('/api/v1/prescriptions')->assertUnauthorized();
        $this->getJson('/api/v1/profile')->assertUnauthorized();
    }

    public function test_unauthenticated_cannot_access_doctor_routes(): void
    {
        $this->getJson('/api/v1/doctor/appointments')->assertUnauthorized();
        $this->getJson('/api/v1/doctor/schedule')->assertUnauthorized();
    }

    public function test_public_routes_are_accessible_without_auth(): void
    {
        $this->getJson('/api/v1/specializations')->assertOk();
        $this->getJson('/api/v1/doctors')->assertOk();
    }
}

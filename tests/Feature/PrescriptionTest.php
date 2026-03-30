<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Prescription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PrescriptionTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctor_can_create_prescription_for_completed_appointment(): void
    {
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->completed()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->postJson("/api/v1/doctor/appointments/{$appointment->id}/prescriptions", [
                'medicine_name' => 'Amoxicillin',
                'dosage' => '500mg',
                'instructions' => 'Take 3 times a day after meals.',
                'duration' => '7 days',
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.medicine_name', 'Amoxicillin');

        $this->assertDatabaseHas('prescriptions', [
            'appointment_id' => $appointment->id,
            'medicine_name' => 'Amoxicillin',
        ]);
    }

    public function test_doctor_cannot_create_prescription_for_pending_appointment(): void
    {
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->pending()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->postJson("/api/v1/doctor/appointments/{$appointment->id}/prescriptions", [
                'medicine_name' => 'Ibuprofen',
                'dosage' => '200mg',
                'instructions' => 'Take as needed.',
                'duration' => '5 days',
            ])->assertStatus(422);
    }

    public function test_patient_can_view_own_prescription(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->completed()->create(['patient_id' => $patient->id]);
        $prescription = Prescription::factory()->create(['appointment_id' => $appointment->id]);

        $this->actingAs($patient)
            ->getJson("/api/v1/prescriptions/{$prescription->id}")
            ->assertOk()
            ->assertJsonPath('data.id', $prescription->id);
    }

    public function test_patient_cannot_view_another_patients_prescription(): void
    {
        $patient = User::factory()->patient()->create();
        $otherPrescription = Prescription::factory()->create();

        $this->actingAs($patient)
            ->getJson("/api/v1/prescriptions/{$otherPrescription->id}")
            ->assertForbidden();
    }

    public function test_patient_can_list_own_prescriptions(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->completed()->create(['patient_id' => $patient->id]);
        Prescription::factory(3)->create(['appointment_id' => $appointment->id]);

        Prescription::factory()->create(); // other patient's

        $response = $this->actingAs($patient)
            ->getJson('/api/v1/prescriptions')
            ->assertOk();

        $this->assertCount(3, $response->json('data'));
    }

    public function test_prescription_requires_all_fields(): void
    {
        $doctor = User::factory()->doctor()->create();
        $appointment = Appointment::factory()->completed()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->postJson("/api/v1/doctor/appointments/{$appointment->id}/prescriptions", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['medicine_name', 'dosage', 'instructions', 'duration']);
    }
}

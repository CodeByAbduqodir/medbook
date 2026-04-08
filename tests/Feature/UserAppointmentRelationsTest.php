<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserAppointmentRelationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctor_appointments_relation_counts_doctor_side_appointments(): void
    {
        $doctor = User::factory()->doctor()->create();
        $patient = User::factory()->patient()->create();

        Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
            'status' => AppointmentStatus::Confirmed,
        ]);

        $freshDoctor = User::query()
            ->whereKey($doctor->id)
            ->withCount(['doctorAppointments as appointments_count'])
            ->firstOrFail();

        $this->assertSame(1, $freshDoctor->appointments_count);
        $this->assertCount(1, $freshDoctor->doctorAppointments);
    }

    public function test_patient_appointments_relation_counts_patient_side_appointments(): void
    {
        $doctor = User::factory()->doctor()->create();
        $patient = User::factory()->patient()->create();

        Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
            'status' => AppointmentStatus::Confirmed,
        ]);

        $freshPatient = User::query()
            ->whereKey($patient->id)
            ->firstOrFail();

        $this->assertCount(1, $freshPatient->patientAppointments);
    }
}

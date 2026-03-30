<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\DoctorProfile;
use App\Models\Review;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_leave_review_for_completed_appointment(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->completed()->create(['patient_id' => $patient->id]);

        $this->actingAs($patient)
            ->postJson("/api/v1/appointments/{$appointment->id}/review", [
                'rating' => 5,
                'comment' => 'Excellent doctor!',
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.rating', 5);

        $this->assertDatabaseHas('reviews', [
            'appointment_id' => $appointment->id,
            'rating' => 5,
        ]);
    }

    public function test_patient_cannot_leave_second_review_for_same_appointment(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->completed()->create(['patient_id' => $patient->id]);
        Review::factory()->create(['appointment_id' => $appointment->id]);

        $this->actingAs($patient)
            ->postJson("/api/v1/appointments/{$appointment->id}/review", [
                'rating' => 3,
            ])->assertForbidden();
    }

    public function test_patient_cannot_review_pending_appointment(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->pending()->create(['patient_id' => $patient->id]);

        $this->actingAs($patient)
            ->postJson("/api/v1/appointments/{$appointment->id}/review", [
                'rating' => 4,
            ])->assertForbidden();
    }

    public function test_patient_cannot_review_another_patients_appointment(): void
    {
        $patient = User::factory()->patient()->create();
        $otherAppointment = Appointment::factory()->completed()->create();

        $this->actingAs($patient)
            ->postJson("/api/v1/appointments/{$otherAppointment->id}/review", [
                'rating' => 4,
            ])->assertForbidden();
    }

    public function test_doctor_rating_recalculates_after_approved_review(): void
    {
        $specialization = Specialization::factory()->create();
        $doctor = User::factory()->doctor()->create();
        $doctorProfile = DoctorProfile::factory()->create([
            'user_id' => $doctor->id,
            'specialization_id' => $specialization->id,
            'rating_avg' => 0,
        ]);

        $appointment = Appointment::factory()->completed()->create(['doctor_id' => $doctor->id]);
        Review::factory()->create([
            'appointment_id' => $appointment->id,
            'rating' => 4,
            'is_approved' => true,
        ]);

        $doctorProfile->refresh();
        $this->assertEquals(4.00, (float) $doctorProfile->rating_avg);
    }

    public function test_unapproved_review_does_not_affect_rating(): void
    {
        $specialization = Specialization::factory()->create();
        $doctor = User::factory()->doctor()->create();
        $doctorProfile = DoctorProfile::factory()->create([
            'user_id' => $doctor->id,
            'specialization_id' => $specialization->id,
            'rating_avg' => 5.00,
        ]);

        $appointment = Appointment::factory()->completed()->create(['doctor_id' => $doctor->id]);
        Review::factory()->create([
            'appointment_id' => $appointment->id,
            'rating' => 1,
            'is_approved' => false,
        ]);

        $doctorProfile->refresh();
        // No approved reviews → rating stays 0
        $this->assertEquals(0.00, (float) $doctorProfile->rating_avg);
    }

    public function test_review_rating_must_be_1_to_5(): void
    {
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->completed()->create(['patient_id' => $patient->id]);

        $this->actingAs($patient)
            ->postJson("/api/v1/appointments/{$appointment->id}/review", ['rating' => 6])
            ->assertStatus(422)->assertJsonValidationErrors('rating');

        $this->actingAs($patient)
            ->postJson("/api/v1/appointments/{$appointment->id}/review", ['rating' => 0])
            ->assertStatus(422)->assertJsonValidationErrors('rating');
    }
}

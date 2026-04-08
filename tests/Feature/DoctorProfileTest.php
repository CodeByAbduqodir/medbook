<?php

namespace Tests\Feature;

use App\Models\DoctorProfile;
use App\Models\Schedule;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctor_profile_endpoint_returns_schedule_data(): void
    {
        $doctor = User::factory()->doctor()->create();
        DoctorProfile::factory()->create(['user_id' => $doctor->id]);
        Schedule::factory()->create(['doctor_id' => $doctor->id]);

        $this->actingAs($doctor)
            ->getJson('/api/v1/doctor/profile')
            ->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'specialization',
                    'experience_years',
                    'bio',
                    'rating_avg',
                    'schedules',
                ],
            ]);
    }

    public function test_doctor_can_update_profile(): void
    {
        $doctor = User::factory()->doctor()->create();
        $specialization = Specialization::factory()->create();
        DoctorProfile::factory()->create([
            'user_id' => $doctor->id,
            'specialization_id' => $specialization->id,
            'experience_years' => 5,
            'bio' => 'Old bio',
        ]);

        $newSpecialization = Specialization::factory()->create();

        $this->actingAs($doctor)
            ->putJson('/api/v1/doctor/profile', [
                'specialization_id' => $newSpecialization->id,
                'experience_years' => 12,
                'bio' => 'Updated bio',
            ])
            ->assertOk()
            ->assertJsonPath('data.specialization.id', $newSpecialization->id)
            ->assertJsonPath('data.experience_years', 12)
            ->assertJsonPath('data.bio', 'Updated bio');

        $this->assertDatabaseHas('doctor_profiles', [
            'user_id' => $doctor->id,
            'specialization_id' => $newSpecialization->id,
            'experience_years' => 12,
            'bio' => 'Updated bio',
        ]);
    }
}

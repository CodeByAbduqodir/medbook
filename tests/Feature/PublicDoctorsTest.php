<?php

namespace Tests\Feature;

use App\Models\DoctorProfile;
use App\Models\Profile;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicDoctorsTest extends TestCase
{
    use RefreshDatabase;

    public function test_doctors_index_returns_doctors_with_profile_data(): void
    {
        $specialization = Specialization::factory()->create([
            'name' => 'Kardiologiya',
        ]);

        $doctor = User::factory()->doctor()->create([
            'name' => 'Dr. Ali Valiyev',
        ]);

        Profile::factory()->create(['user_id' => $doctor->id]);
        DoctorProfile::factory()->create([
            'user_id' => $doctor->id,
            'specialization_id' => $specialization->id,
            'experience_years' => 9,
            'bio' => 'Tajribali shifokor',
            'rating_avg' => 4.9,
        ]);

        $this->getJson('/api/v1/doctors')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Dr. Ali Valiyev')
            ->assertJsonPath('data.0.doctor_profile.specialization.name', 'Kardiologiya')
            ->assertJsonPath('data.0.profile.avatar_url', null);
    }
}

<?php

namespace Tests\Feature;

use App\Models\DoctorProfile;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DoctorAdminScreenTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_doctors_screen_renders_doctor_rating_without_type_error(): void
    {
        $admin = User::factory()->admin()->create();
        $admin->forceFill([
            'permissions' => [
                'platform.index' => true,
                'platform.systems.roles' => true,
                'platform.systems.users' => true,
            ],
        ])->save();

        $specialization = Specialization::factory()->create(['name' => 'Cardiology']);
        $doctor = User::factory()->doctor()->create([
            'name' => 'Dr. Alice',
        ]);

        DoctorProfile::factory()->create([
            'user_id' => $doctor->id,
            'specialization_id' => $specialization->id,
            'rating_avg' => '4.50',
        ]);

        $this->actingAs($admin)
            ->get('/admin/doctors')
            ->assertOk()
            ->assertSee('Dr. Alice')
            ->assertSee('4.50 ★');
    }
}

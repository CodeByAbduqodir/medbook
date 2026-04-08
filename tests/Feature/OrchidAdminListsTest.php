<?php

namespace Tests\Feature;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Review;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Orchid\Platform\Models\Role;
use Tests\TestCase;

class OrchidAdminListsTest extends TestCase
{
    use RefreshDatabase;

    private function adminUser(): User
    {
        $admin = User::factory()->admin()->create();
        $admin->forceFill([
            'permissions' => [
                'platform.index' => true,
                'platform.systems.roles' => true,
                'platform.systems.users' => true,
            ],
        ])->save();

        return $admin;
    }

    public function test_admin_appointments_list_renders_without_get_content_error(): void
    {
        $admin = $this->adminUser();
        $doctor = User::factory()->doctor()->create(['name' => 'Dr. Strange']);
        $patient = User::factory()->patient()->create(['name' => 'Tony Stark']);

        Appointment::factory()->create([
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
            'status' => AppointmentStatus::Confirmed,
        ]);

        $this->actingAs($admin)
            ->get('/admin/appointments')
            ->assertOk()
            ->assertSee('Dr. Strange')
            ->assertSee('Tony Stark');
    }

    public function test_admin_reviews_list_renders_without_get_content_error(): void
    {
        $admin = $this->adminUser();
        $doctor = User::factory()->doctor()->create();
        $patient = User::factory()->patient()->create();
        $appointment = Appointment::factory()->completed()->create([
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
        ]);

        Review::factory()->create([
            'appointment_id' => $appointment->id,
        ]);

        $this->actingAs($admin)
            ->get('/admin/reviews')
            ->assertOk();
    }

    public function test_admin_users_list_renders_without_get_content_error(): void
    {
        $admin = $this->adminUser();

        User::factory()->doctor()->create(['name' => 'Doctor User']);

        $this->actingAs($admin)
            ->get('/admin/users')
            ->assertOk()
            ->assertSee('Doctor User');
    }

    public function test_admin_roles_list_renders_without_get_content_error(): void
    {
        $admin = $this->adminUser();

        Role::create([
            'name' => 'Support',
            'slug' => 'support',
            'permissions' => [
                'platform.index' => true,
            ],
        ]);

        $this->actingAs($admin)
            ->get('/admin/roles')
            ->assertOk()
            ->assertSee('Support');
    }

    public function test_admin_specializations_list_renders_without_get_content_error(): void
    {
        $admin = $this->adminUser();

        Specialization::factory()->create([
            'name' => 'Cardiology',
        ]);

        $this->actingAs($admin)
            ->get('/admin/specializations')
            ->assertOk()
            ->assertSee('Cardiology');
    }
}

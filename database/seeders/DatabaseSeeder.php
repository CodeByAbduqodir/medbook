<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\DoctorProfile;
use App\Models\Prescription;
use App\Models\Profile;
use App\Models\Review;
use App\Models\Schedule;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(SpecializationSeeder::class);

        // Admin
        $admin = User::factory()->admin()->create([
            'name' => 'Admin User',
            'email' => 'admin@medbook.test',
            'password' => Hash::make('password'),
        ]);
        Profile::factory()->create(['user_id' => $admin->id]);

        // Grant admin all platform permissions
        $admin->update([
            'permissions' => [
                'platform.systems.roles',
                'platform.systems.users',
            ],
        ]);

        $specializations = Specialization::all();

        // 3 doctors with full profiles and schedules
        $doctors = User::factory(3)->doctor()->create();
        foreach ($doctors as $index => $doctor) {
            Profile::factory()->create(['user_id' => $doctor->id]);

            DoctorProfile::factory()->create([
                'user_id' => $doctor->id,
                'specialization_id' => $specializations->get($index)->id,
            ]);

            // Mon-Fri schedule
            foreach (range(1, 5) as $dayOfWeek) {
                Schedule::factory()->create([
                    'doctor_id' => $doctor->id,
                    'day_of_week' => $dayOfWeek,
                    'start_time' => '09:00:00',
                    'end_time' => '17:00:00',
                    'is_active' => true,
                ]);
            }
        }

        // 10 patients
        $patients = User::factory(10)->patient()->create();
        foreach ($patients as $patient) {
            Profile::factory()->create(['user_id' => $patient->id]);
        }

        // Appointments: completed ones (for prescriptions and reviews)
        foreach ($doctors as $doctor) {
            foreach ($patients->random(4) as $patient) {
                $appointment = Appointment::factory()->completed()->create([
                    'doctor_id' => $doctor->id,
                    'patient_id' => $patient->id,
                ]);

                Prescription::factory()->create(['appointment_id' => $appointment->id]);

                Review::factory()->approved()->create(['appointment_id' => $appointment->id]);

                // Recalculate doctor rating
                $doctor->doctorProfile->recalculateRating();
            }

            // Pending and confirmed upcoming appointments
            foreach ($patients->random(2) as $patient) {
                Appointment::factory()->pending()->create([
                    'doctor_id' => $doctor->id,
                    'patient_id' => $patient->id,
                ]);
            }

            foreach ($patients->random(2) as $patient) {
                Appointment::factory()->confirmed()->create([
                    'doctor_id' => $doctor->id,
                    'patient_id' => $patient->id,
                ]);
            }
        }
    }
}

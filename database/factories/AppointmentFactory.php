<?php

namespace Database\Factories;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startTime = fake()->dateTimeBetween('+1 day', '+30 days');
        $endTime = (clone $startTime)->modify('+30 minutes');

        return [
            'doctor_id' => User::factory()->doctor(),
            'patient_id' => User::factory()->patient(),
            'start_time' => $startTime,
            'end_time' => $endTime,
            'status' => AppointmentStatus::Pending,
            'diagnosis' => null,
            'cancelled_by' => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => AppointmentStatus::Pending]);
    }

    public function confirmed(): static
    {
        return $this->state(fn () => ['status' => AppointmentStatus::Confirmed]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => AppointmentStatus::Completed,
            'start_time' => fake()->dateTimeBetween('-30 days', '-1 day'),
            'end_time' => fake()->dateTimeBetween('-29 days', '-1 day'),
            'diagnosis' => fake()->sentence(),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => [
            'status' => AppointmentStatus::Cancelled,
            'cancelled_by' => User::factory()->patient(),
        ]);
    }
}

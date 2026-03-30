<?php

namespace Database\Factories;

use App\Models\DoctorProfile;
use App\Models\Specialization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DoctorProfile>
 */
class DoctorProfileFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory()->doctor(),
            'specialization_id' => Specialization::factory(),
            'experience_years' => fake()->numberBetween(1, 30),
            'bio' => fake()->paragraph(),
            'rating_avg' => 0,
        ];
    }
}

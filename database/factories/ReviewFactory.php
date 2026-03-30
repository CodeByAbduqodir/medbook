<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Review>
 */
class ReviewFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'appointment_id' => Appointment::factory()->completed(),
            'rating' => fake()->numberBetween(1, 5),
            'comment' => fake()->optional(0.7)->paragraph(),
            'is_approved' => false,
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => ['is_approved' => true]);
    }
}

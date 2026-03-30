<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\Prescription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Prescription>
 */
class PrescriptionFactory extends Factory
{
    private static array $medicines = [
        'Amoxicillin', 'Ibuprofen', 'Paracetamol', 'Omeprazole',
        'Metformin', 'Lisinopril', 'Atorvastatin', 'Amlodipine',
        'Metoprolol', 'Ciprofloxacin',
    ];

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'appointment_id' => Appointment::factory()->completed(),
            'medicine_name' => fake()->randomElement(self::$medicines),
            'dosage' => fake()->randomElement(['500mg', '250mg', '100mg', '10mg', '20mg', '5mg']),
            'instructions' => fake()->sentence(),
            'duration' => fake()->randomElement(['7 days', '10 days', '14 days', '30 days', '1 month']),
        ];
    }
}

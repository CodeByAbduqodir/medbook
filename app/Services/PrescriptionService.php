<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Prescription;
use Illuminate\Validation\ValidationException;

class PrescriptionService
{
    public function createPrescription(Appointment $appointment, array $data): Prescription
    {
        if ($appointment->status !== AppointmentStatus::Completed) {
            throw ValidationException::withMessages([
                'appointment' => ['Prescriptions can only be created for completed appointments.'],
            ]);
        }

        return $appointment->prescriptions()->create($data);
    }
}

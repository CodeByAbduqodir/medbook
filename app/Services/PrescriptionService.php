<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Prescription;

class PrescriptionService
{
    public function createPrescription(Appointment $appointment, array $data): Prescription
    {
        if ($appointment->status !== AppointmentStatus::Completed) {
            throw new \RuntimeException('Prescriptions can only be created for completed appointments.');
        }

        return $appointment->prescriptions()->create($data);
    }
}

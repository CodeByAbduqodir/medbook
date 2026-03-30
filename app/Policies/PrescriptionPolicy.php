<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Prescription;
use App\Models\User;

class PrescriptionPolicy
{
    public function view(User $user, Prescription $prescription): bool
    {
        $appointment = $prescription->appointment;

        return $user->id === $appointment->patient_id
            || $user->id === $appointment->doctor_id;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::Doctor;
    }
}

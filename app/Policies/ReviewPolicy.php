<?php

namespace App\Policies;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\User;

class ReviewPolicy
{
    public function create(User $user, Appointment $appointment): bool
    {
        return $user->role === UserRole::Patient
            && $user->id === $appointment->patient_id
            && $appointment->status === AppointmentStatus::Completed
            && ! $appointment->review()->exists();
    }
}

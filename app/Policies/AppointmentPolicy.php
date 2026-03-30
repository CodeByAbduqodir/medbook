<?php

namespace App\Policies;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    public function view(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->patient_id
            || $user->id === $appointment->doctor_id;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::Patient;
    }

    public function cancel(User $user, Appointment $appointment): bool
    {
        $isCancellable = in_array($appointment->status, [
            AppointmentStatus::Pending,
            AppointmentStatus::Confirmed,
        ]);

        return $isCancellable && (
            $user->id === $appointment->patient_id
            || $user->id === $appointment->doctor_id
        );
    }

    public function confirm(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->doctor_id
            && $appointment->status === AppointmentStatus::Pending;
    }

    public function complete(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->doctor_id
            && $appointment->status === AppointmentStatus::Confirmed;
    }

    public function review(User $user, Appointment $appointment): bool
    {
        return $user->id === $appointment->patient_id
            && $appointment->status === AppointmentStatus::Completed
            && ! $appointment->review()->exists();
    }
}

<?php

namespace App\Policies;

use App\Models\DoctorProfile;
use App\Models\User;

class DoctorProfilePolicy
{
    public function update(User $user, DoctorProfile $doctorProfile): bool
    {
        return $user->id === $doctorProfile->user_id;
    }
}

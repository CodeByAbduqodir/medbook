<?php

namespace App\Policies;

use App\Models\Schedule;
use App\Models\User;

class SchedulePolicy
{
    public function manage(User $user, Schedule $schedule): bool
    {
        return $user->id === $schedule->doctor_id;
    }
}

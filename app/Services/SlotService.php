<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;

class SlotService
{
    public function getAvailableSlots(User $doctor, Carbon $date): array
    {
        $dayOfWeek = (int) $date->dayOfWeek;

        $schedule = $doctor->schedules()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->first();

        if (! $schedule) {
            return [];
        }

        return $schedule->generateSlots($date, config('medbook.slot_duration_minutes', 30));
    }

    public function isSlotAvailable(User $doctor, Carbon $startTime, Carbon $endTime): bool
    {
        return ! Appointment::query()
            ->where('doctor_id', $doctor->id)
            ->whereNotIn('status', [AppointmentStatus::Cancelled->value])
            ->where(function ($q) use ($startTime, $endTime) {
                $q->where(function ($q2) use ($startTime, $endTime) {
                    $q2->where('start_time', '<', $endTime)
                        ->where('end_time', '>', $startTime);
                });
            })
            ->lockForUpdate()
            ->exists();
    }
}

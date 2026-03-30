<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\User;
use App\Notifications\AppointmentCancelledNotification;
use App\Notifications\AppointmentCompletedNotification;
use App\Notifications\AppointmentConfirmedNotification;
use App\Notifications\AppointmentCreatedNotification;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\ValidationException;

class AppointmentService
{
    public function __construct(private SlotService $slotService) {}

    public function bookSlot(User $doctor, User $patient, Carbon $startTime): Appointment
    {
        $appointment = DB::transaction(function () use ($doctor, $patient, $startTime) {
            $durationMinutes = config('medbook.slot_duration_minutes', 30);
            $endTime = $startTime->copy()->addMinutes($durationMinutes);

            if (! $this->slotService->isSlotAvailable($doctor, $startTime, $endTime)) {
                throw ValidationException::withMessages([
                    'start_time' => ['This time slot is not available.'],
                ]);
            }

            return Appointment::create([
                'doctor_id' => $doctor->id,
                'patient_id' => $patient->id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'status' => AppointmentStatus::Pending,
            ]);
        });

        $appointment->load(['doctor', 'patient']);
        Notification::send(
            [$appointment->doctor, $appointment->patient],
            new AppointmentCreatedNotification($appointment)
        );

        return $appointment;
    }

    public function cancelAppointment(Appointment $appointment, User $cancelledBy): void
    {
        $appointment->update([
            'status' => AppointmentStatus::Cancelled,
            'cancelled_by' => $cancelledBy->id,
        ]);

        $appointment->load(['doctor', 'patient', 'cancelledBy']);
        Notification::send(
            [$appointment->doctor, $appointment->patient],
            new AppointmentCancelledNotification($appointment)
        );
    }

    public function confirmAppointment(Appointment $appointment): void
    {
        if ($appointment->status !== AppointmentStatus::Pending) {
            throw new \RuntimeException('Only pending appointments can be confirmed.');
        }

        $appointment->update(['status' => AppointmentStatus::Confirmed]);

        $appointment->load(['doctor', 'patient']);
        $appointment->patient->notify(new AppointmentConfirmedNotification($appointment));
    }

    public function completeAppointment(Appointment $appointment, string $diagnosis): void
    {
        if ($appointment->status !== AppointmentStatus::Confirmed) {
            throw new \RuntimeException('Only confirmed appointments can be completed.');
        }

        $appointment->update([
            'status' => AppointmentStatus::Completed,
            'diagnosis' => $diagnosis,
        ]);

        $appointment->load(['doctor', 'patient']);
        $appointment->patient->notify(new AppointmentCompletedNotification($appointment));
    }
}

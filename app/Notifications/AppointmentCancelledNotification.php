<?php

namespace App\Notifications;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AppointmentCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly Appointment $appointment) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $appointment = $this->appointment;

        return (new MailMessage)
            ->subject('Appointment Cancelled')
            ->greeting('Hello, '.$notifiable->name.'!')
            ->line('An appointment has been cancelled.')
            ->line('Doctor: '.$appointment->doctor->name)
            ->line('Patient: '.$appointment->patient->name)
            ->line('Date & Time: '.$appointment->start_time->format('d M Y, H:i'))
            ->line('Cancelled by: '.($appointment->cancelledBy?->name ?? 'Unknown'));
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'appointment_cancelled',
            'appointment_id' => $this->appointment->id,
            'doctor_name' => $this->appointment->doctor->name,
            'patient_name' => $this->appointment->patient->name,
            'start_time' => $this->appointment->start_time->toIso8601String(),
            'cancelled_by' => $this->appointment->cancelledBy?->name,
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Appointment;

use App\Models\Appointment;
use Carbon\Carbon;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class AppointmentListLayout extends Table
{
    public $target = 'appointments';

    /** @return TD[] */
    public function columns(): array
    {
        return [
            TD::make('id', '#')
                ->sort()
                ->cantHide()
                ->render(fn (Appointment $appointment) => $appointment->id)
                ->width('60px'),

            TD::make('doctor', 'Doctor')
                ->render(fn (Appointment $appointment) => $appointment->doctor?->name ?? '—'),

            TD::make('patient', 'Patient')
                ->render(fn (Appointment $appointment) => $appointment->patient?->name ?? '—'),

            TD::make('start_time', 'Date & Time')
                ->render(fn (Appointment $appointment) => Carbon::parse($appointment->start_time)->toDayDateTimeString())
                ->sort(),

            TD::make('status', 'Status')
                ->sort()
                ->render(fn (Appointment $appointment) => view('orchid.badge', [
                    'value' => $appointment->status->value,
                    'color' => match ($appointment->status->value) {
                        'pending' => 'warning',
                        'confirmed' => 'info',
                        'completed' => 'success',
                        'cancelled' => 'danger',
                        default => 'secondary',
                    },
                ])),

            TD::make('diagnosis', 'Diagnosis')
                ->defaultHidden()
                ->render(fn (Appointment $appointment) => $appointment->diagnosis ?? '—'),

            TD::make('Actions')
                ->align(TD::ALIGN_CENTER)
                ->width('100px')
                ->render(fn (Appointment $appointment) => DropDown::make()
                    ->icon('bs.three-dots-vertical')
                    ->list([
                        Button::make('Cancel')
                            ->icon('bs.x-circle')
                            ->confirm('Are you sure you want to cancel this appointment?')
                            ->method('cancel', ['id' => $appointment->id])
                            ->canSee($appointment->status->value !== 'cancelled' && $appointment->status->value !== 'completed'),
                    ])),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Appointment;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Orchid\Layouts\Appointment\AppointmentListLayout;
use Illuminate\Http\Request;
use Orchid\Screen\Action;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class AppointmentListScreen extends Screen
{
    public function query(Request $request): iterable
    {
        $query = Appointment::with(['doctor', 'patient'])
            ->orderByDesc('start_time');

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        return [
            'appointments' => $query->paginate(),
        ];
    }

    public function name(): ?string
    {
        return 'Appointments';
    }

    public function description(): ?string
    {
        return 'All appointments in the system.';
    }

    /** @return Action[] */
    public function commandBar(): iterable
    {
        return [];
    }

    public function layout(): iterable
    {
        return [
            Layout::rows([
                Select::make('status')
                    ->options([
                        '' => 'All statuses',
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled',
                    ])
                    ->title('Filter by status')
                    ->empty('All statuses'),
            ]),

            AppointmentListLayout::class,
        ];
    }

    public function cancel(Request $request): void
    {
        $appointment = Appointment::findOrFail($request->get('id'));

        if (in_array($appointment->status, [AppointmentStatus::Cancelled, AppointmentStatus::Completed], true)) {
            Toast::warning('This appointment cannot be cancelled.');

            return;
        }

        $appointment->update(['status' => AppointmentStatus::Cancelled]);

        Toast::info('Appointment has been cancelled.');
    }
}

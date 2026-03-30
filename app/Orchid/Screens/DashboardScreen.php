<?php

declare(strict_types=1);

namespace App\Orchid\Screens;

use App\Enums\AppointmentStatus;
use App\Enums\UserRole;
use App\Models\Appointment;
use App\Models\Review;
use App\Models\User;
use Orchid\Screen\Action;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;

class DashboardScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'metrics' => [
                'total_users' => User::count(),
                'total_doctors' => User::where('role', UserRole::Doctor)->count(),
                'total_patients' => User::where('role', UserRole::Patient)->count(),
                'total_appointments' => Appointment::count(),
                'pending_appointments' => Appointment::where('status', AppointmentStatus::Pending)->count(),
                'completed_appointments' => Appointment::where('status', AppointmentStatus::Completed)->count(),
                'cancelled_appointments' => Appointment::where('status', AppointmentStatus::Cancelled)->count(),
                'pending_reviews' => Review::where('is_approved', false)->count(),
            ],
        ];
    }

    public function name(): ?string
    {
        return 'Dashboard';
    }

    public function description(): ?string
    {
        return 'MedBook — overview of the system.';
    }

    /** @return Action[] */
    public function commandBar(): iterable
    {
        return [];
    }

    public function layout(): iterable
    {
        return [
            Layout::metrics([
                'Total Users' => 'metrics.total_users',
                'Total Doctors' => 'metrics.total_doctors',
                'Total Patients' => 'metrics.total_patients',
                'Total Appointments' => 'metrics.total_appointments',
                'Pending Appointments' => 'metrics.pending_appointments',
                'Completed Appointments' => 'metrics.completed_appointments',
                'Cancelled Appointments' => 'metrics.cancelled_appointments',
                'Reviews Pending Approval' => 'metrics.pending_reviews',
            ]),
        ];
    }
}

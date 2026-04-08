<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Doctor;

use App\Enums\UserRole;
use App\Models\User;
use App\Orchid\Layouts\Doctor\DoctorListLayout;
use Orchid\Screen\Action;
use Orchid\Screen\Screen;

class DoctorListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'doctors' => User::where('role', UserRole::Doctor)
                ->with(['doctorProfile.specialization'])
                ->withCount(['doctorAppointments as appointments_count'])
                ->orderByDesc('id')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return 'Doctors';
    }

    public function description(): ?string
    {
        return 'All registered doctors with their specializations and statistics.';
    }

    /** @return Action[] */
    public function commandBar(): iterable
    {
        return [];
    }

    public function layout(): iterable
    {
        return [
            DoctorListLayout::class,
        ];
    }
}

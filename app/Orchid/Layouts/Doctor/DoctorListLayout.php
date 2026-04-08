<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Doctor;

use App\Models\User;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class DoctorListLayout extends Table
{
    public $target = 'doctors';

    /** @return TD[] */
    public function columns(): array
    {
        return [
            TD::make('id', '#')
                ->sort()
                ->width('60px'),

            TD::make('name', 'Name')
                ->sort()
                ->cantHide()
                ->render(fn (User $user) => Link::make($user->name)
                    ->route('platform.systems.users.edit', $user->id)),

            TD::make('email', 'Email')
                ->render(fn (User $user) => $user->email),

            TD::make('specialization', 'Specialization')
                ->render(fn (User $user) => $user->doctorProfile?->specialization?->name ?? '—'),

            TD::make('experience_years', 'Experience')
                ->render(fn (User $user) => $user->doctorProfile?->experience_years
                    ? $user->doctorProfile->experience_years.' yrs'
                    : '—'),

            TD::make('rating_avg', 'Rating')
                ->sort()
                ->render(function (User $user): string {
                    $rating = $user->doctorProfile?->rating_avg;

                    if ($rating === null || (float) $rating <= 0) {
                        return '—';
                    }

                    return number_format((float) $rating, 2).' ★';
                }),

            TD::make('appointments_count', 'Appointments')
                ->render(fn (User $user) => intval($user->appointments_count)),
        ];
    }
}

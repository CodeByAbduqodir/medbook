<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Specialization;

use App\Models\Specialization;
use Carbon\Carbon;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class SpecializationListLayout extends Table
{
    public $target = 'specializations';

    /** @return TD[] */
    public function columns(): array
    {
        return [
            TD::make('id', '#')
                ->sort()
                ->render(fn (Specialization $specialization) => $specialization->id)
                ->width('60px'),

            TD::make('name', 'Name')
                ->sort()
                ->cantHide()
                ->render(fn (Specialization $specialization) => Link::make($specialization->name)
                    ->route('platform.specializations.edit', $specialization->id)),

            TD::make('description', 'Description')
                ->render(fn (Specialization $specialization) => $specialization->description ?? '—'),

            TD::make('doctors_count', 'Doctors')
                ->render(fn (Specialization $specialization) => $specialization->doctors_count),

            TD::make('created_at', 'Created')
                ->render(fn (Specialization $specialization) => Carbon::parse($specialization->created_at)->toDayDateTimeString())
                ->sort()
                ->defaultHidden(),

            TD::make('Actions')
                ->align(TD::ALIGN_CENTER)
                ->width('100px')
                ->render(fn (Specialization $specialization) => DropDown::make()
                    ->icon('bs.three-dots-vertical')
                    ->list([
                        Link::make('Edit')
                            ->icon('bs.pencil')
                            ->route('platform.specializations.edit', $specialization->id),

                        Button::make('Delete')
                            ->icon('bs.trash3')
                            ->confirm('Are you sure you want to delete this specialization?')
                            ->method('remove', ['id' => $specialization->id]),
                    ])),
        ];
    }
}

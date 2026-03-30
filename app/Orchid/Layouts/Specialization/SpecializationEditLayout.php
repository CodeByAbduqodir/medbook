<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Specialization;

use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Layouts\Rows;

class SpecializationEditLayout extends Rows
{
    public function fields(): array
    {
        return [
            Input::make('specialization.name')
                ->title('Name')
                ->placeholder('e.g. Cardiology')
                ->required(),

            TextArea::make('specialization.description')
                ->title('Description')
                ->placeholder('Brief description of this specialization')
                ->rows(4),
        ];
    }
}

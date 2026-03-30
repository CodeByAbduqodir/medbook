<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Specialization;

use App\Models\Specialization;
use App\Orchid\Layouts\Specialization\SpecializationListLayout;
use Illuminate\Http\Request;
use Orchid\Screen\Action;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Toast;

class SpecializationListScreen extends Screen
{
    public function query(): iterable
    {
        return [
            'specializations' => Specialization::withCount('doctorProfiles as doctors_count')
                ->orderBy('name')
                ->paginate(),
        ];
    }

    public function name(): ?string
    {
        return 'Specializations';
    }

    public function description(): ?string
    {
        return 'Manage medical specializations.';
    }

    /** @return Action[] */
    public function commandBar(): iterable
    {
        return [
            Link::make('Add Specialization')
                ->icon('bs.plus-circle')
                ->route('platform.specializations.create'),
        ];
    }

    public function layout(): iterable
    {
        return [
            SpecializationListLayout::class,
        ];
    }

    public function remove(Request $request): void
    {
        Specialization::findOrFail($request->get('id'))->delete();
        Toast::info('Specialization has been deleted.');
    }
}

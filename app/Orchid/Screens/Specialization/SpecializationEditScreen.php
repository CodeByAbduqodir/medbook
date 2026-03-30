<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Specialization;

use App\Models\Specialization;
use App\Orchid\Layouts\Specialization\SpecializationEditLayout;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Orchid\Screen\Action;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Facades\Toast;

class SpecializationEditScreen extends Screen
{
    public ?Specialization $specialization = null;

    public function query(Specialization $specialization): iterable
    {
        return [
            'specialization' => $specialization,
        ];
    }

    public function name(): ?string
    {
        return $this->specialization?->exists
            ? 'Edit Specialization'
            : 'Create Specialization';
    }

    public function description(): ?string
    {
        return $this->specialization?->exists
            ? "Editing: {$this->specialization->name}"
            : 'Add a new medical specialization.';
    }

    /** @return Action[] */
    public function commandBar(): iterable
    {
        return [
            Button::make('Save')
                ->icon('bs.check-circle')
                ->method('save'),

            Button::make('Delete')
                ->icon('bs.trash3')
                ->confirm('Are you sure you want to delete this specialization?')
                ->method('remove')
                ->canSee($this->specialization?->exists ?? false),
        ];
    }

    public function layout(): iterable
    {
        return [
            Layout::block(SpecializationEditLayout::class)
                ->title('Specialization Details')
                ->description('Fill in the name and description.'),
        ];
    }

    public function save(Request $request, Specialization $specialization): RedirectResponse
    {
        $request->validate([
            'specialization.name' => ['required', 'string', 'max:255'],
        ]);

        $specialization->fill($request->input('specialization'))->save();

        Toast::info('Specialization saved successfully.');

        return redirect()->route('platform.specializations');
    }

    public function remove(Specialization $specialization): RedirectResponse
    {
        $specialization->delete();

        Toast::info('Specialization has been deleted.');

        return redirect()->route('platform.specializations');
    }
}

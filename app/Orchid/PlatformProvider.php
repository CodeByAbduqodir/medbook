<?php

declare(strict_types=1);

namespace App\Orchid;

use Orchid\Platform\Dashboard;
use Orchid\Platform\ItemPermission;
use Orchid\Platform\OrchidServiceProvider;
use Orchid\Screen\Actions\Menu;

class PlatformProvider extends OrchidServiceProvider
{
    public function boot(Dashboard $dashboard): void
    {
        parent::boot($dashboard);
    }

    /** @return Menu[] */
    public function menu(): array
    {
        return [
            Menu::make('Dashboard')
                ->icon('bs.speedometer2')
                ->title('MedBook')
                ->route('platform.main'),

            Menu::make('Doctors')
                ->icon('bs.person-badge')
                ->route('platform.doctors'),

            Menu::make('Appointments')
                ->icon('bs.calendar2-check')
                ->route('platform.appointments'),

            Menu::make('Reviews')
                ->icon('bs.star')
                ->route('platform.reviews'),

            Menu::make('Specializations')
                ->icon('bs.tag')
                ->route('platform.specializations')
                ->divider(),

            Menu::make(__('Users'))
                ->icon('bs.people')
                ->route('platform.systems.users')
                ->permission('platform.systems.users')
                ->title(__('Access Controls')),

            Menu::make(__('Roles'))
                ->icon('bs.shield')
                ->route('platform.systems.roles')
                ->permission('platform.systems.roles'),
        ];
    }

    /** @return ItemPermission[] */
    public function permissions(): array
    {
        return [
            ItemPermission::group(__('System'))
                ->addPermission('platform.systems.roles', __('Roles'))
                ->addPermission('platform.systems.users', __('Users')),
        ];
    }
}

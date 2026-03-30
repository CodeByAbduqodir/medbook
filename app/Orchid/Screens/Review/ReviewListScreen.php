<?php

declare(strict_types=1);

namespace App\Orchid\Screens\Review;

use App\Models\Review;
use App\Orchid\Layouts\Review\ReviewListLayout;
use Illuminate\Http\Request;
use Orchid\Screen\Action;
use Orchid\Screen\Screen;
use Orchid\Support\Facades\Toast;

class ReviewListScreen extends Screen
{
    public function query(Request $request): iterable
    {
        $query = Review::with(['appointment.doctor', 'appointment.patient'])
            ->orderByDesc('created_at');

        if ($request->get('pending')) {
            $query->where('is_approved', false);
        }

        return [
            'reviews' => $query->paginate(),
        ];
    }

    public function name(): ?string
    {
        return 'Reviews Moderation';
    }

    public function description(): ?string
    {
        return 'Approve or hide patient reviews.';
    }

    /** @return Action[] */
    public function commandBar(): iterable
    {
        return [];
    }

    public function layout(): iterable
    {
        return [
            ReviewListLayout::class,
        ];
    }

    public function approve(Request $request): void
    {
        Review::findOrFail($request->get('id'))->update(['is_approved' => true]);
        Toast::info('Review has been approved.');
    }

    public function hide(Request $request): void
    {
        Review::findOrFail($request->get('id'))->update(['is_approved' => false]);
        Toast::info('Review has been hidden.');
    }

    public function remove(Request $request): void
    {
        Review::findOrFail($request->get('id'))->delete();
        Toast::info('Review has been deleted.');
    }
}

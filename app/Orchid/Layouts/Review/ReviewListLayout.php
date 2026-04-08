<?php

declare(strict_types=1);

namespace App\Orchid\Layouts\Review;

use App\Models\Review;
use Carbon\Carbon;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;
use Orchid\Screen\Layouts\Table;
use Orchid\Screen\TD;

class ReviewListLayout extends Table
{
    public $target = 'reviews';

    /** @return TD[] */
    public function columns(): array
    {
        return [
            TD::make('id', '#')
                ->sort()
                ->render(fn (Review $review) => $review->id)
                ->width('60px'),

            TD::make('patient', 'Patient')
                ->render(fn (Review $review) => $review->appointment?->patient?->name ?? '—'),

            TD::make('doctor', 'Doctor')
                ->render(fn (Review $review) => $review->appointment?->doctor?->name ?? '—'),

            TD::make('rating', 'Rating')
                ->sort()
                ->render(fn (Review $review) => str_repeat('★', $review->rating).str_repeat('☆', 5 - $review->rating)),

            TD::make('comment', 'Comment')
                ->width('300px')
                ->render(fn (Review $review) => $review->comment ?? '—'),

            TD::make('is_approved', 'Status')
                ->sort()
                ->render(fn (Review $review) => $review->is_approved
                    ? '<span class="badge bg-success">Approved</span>'
                    : '<span class="badge bg-warning text-dark">Pending</span>'),

            TD::make('created_at', 'Created')
                ->render(fn (Review $review) => Carbon::parse($review->created_at)->toDayDateTimeString())
                ->sort()
                ->defaultHidden(),

            TD::make('Actions')
                ->align(TD::ALIGN_CENTER)
                ->width('100px')
                ->render(fn (Review $review) => DropDown::make()
                    ->icon('bs.three-dots-vertical')
                    ->list([
                        Button::make('Approve')
                            ->icon('bs.check-circle')
                            ->method('approve', ['id' => $review->id])
                            ->canSee(! $review->is_approved),

                        Button::make('Hide')
                            ->icon('bs.eye-slash')
                            ->method('hide', ['id' => $review->id])
                            ->canSee($review->is_approved),

                        Button::make('Delete')
                            ->icon('bs.trash3')
                            ->confirm('Are you sure you want to delete this review?')
                            ->method('remove', ['id' => $review->id]),
                    ])),
        ];
    }
}

<?php

namespace App\Observers;

use App\Models\Review;

class ReviewObserver
{
    public function created(Review $review): void
    {
        $this->recalculate($review);
    }

    public function updated(Review $review): void
    {
        $this->recalculate($review);
    }

    public function deleted(Review $review): void
    {
        $this->recalculate($review);
    }

    private function recalculate(Review $review): void
    {
        $review->load('appointment.doctor.doctorProfile');
        $review->appointment->doctor->doctorProfile?->recalculateRating();
    }
}

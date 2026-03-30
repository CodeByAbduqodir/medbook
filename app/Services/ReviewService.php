<?php

namespace App\Services;

use App\Enums\AppointmentStatus;
use App\Models\Appointment;
use App\Models\Review;

class ReviewService
{
    public function createReview(Appointment $appointment, array $data): Review
    {
        if ($appointment->status !== AppointmentStatus::Completed) {
            throw new \RuntimeException('Reviews can only be left for completed appointments.');
        }

        if ($appointment->review()->exists()) {
            throw new \RuntimeException('A review has already been submitted for this appointment.');
        }

        // Rating recalculation is handled by ReviewObserver
        return $appointment->review()->create($data);
    }
}

<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['doctor_id', 'day_of_week', 'start_time', 'end_time', 'is_active'])]
class Schedule extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'day_of_week' => 'integer',
        ];
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    /**
     * Generate available time slots for a given date.
     *
     * @return array<int, array{start_time: string, end_time: string}>
     */
    public function generateSlots(Carbon $date, int $durationMinutes = 30): array
    {
        $bookedSlots = Appointment::query()
            ->where('doctor_id', $this->doctor_id)
            ->whereDate('start_time', $date)
            ->whereNotIn('status', ['cancelled'])
            ->pluck('start_time')
            ->map(fn ($t) => Carbon::parse($t)->format('H:i'))
            ->toArray();

        $slots = [];
        $current = Carbon::parse($date->format('Y-m-d').' '.$this->start_time);
        $end = Carbon::parse($date->format('Y-m-d').' '.$this->end_time);

        while ($current->copy()->addMinutes($durationMinutes)->lte($end)) {
            $slotEnd = $current->copy()->addMinutes($durationMinutes);
            $slots[] = [
                'start_time' => $current->toIso8601String(),
                'end_time' => $slotEnd->toIso8601String(),
                'is_available' => ! in_array($current->format('H:i'), $bookedSlots),
            ];
            $current->addMinutes($durationMinutes);
        }

        return $slots;
    }
}

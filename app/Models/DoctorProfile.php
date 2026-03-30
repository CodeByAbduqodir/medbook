<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'specialization_id', 'experience_years', 'bio', 'rating_avg'])]
class DoctorProfile extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'rating_avg' => 'decimal:2',
            'experience_years' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function specialization(): BelongsTo
    {
        return $this->belongsTo(Specialization::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class, 'doctor_id', 'user_id');
    }

    public function recalculateRating(): void
    {
        $avgRating = Review::query()
            ->whereHas('appointment', fn ($q) => $q->where('doctor_id', $this->user_id))
            ->where('is_approved', true)
            ->avg('rating');

        $this->update(['rating_avg' => round($avgRating ?? 0, 2)]);
    }
}

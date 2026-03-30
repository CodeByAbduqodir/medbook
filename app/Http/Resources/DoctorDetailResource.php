<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        /** @var User $this */
        $doctorProfile = $this->doctorProfile;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'avatar' => $this->profile?->avatar,
            'specialization' => SpecializationResource::make($doctorProfile?->specialization),
            'experience_years' => $doctorProfile?->experience_years,
            'bio' => $doctorProfile?->bio,
            'rating_avg' => $doctorProfile?->rating_avg,
            'schedules' => ScheduleResource::collection($this->schedules),
            'reviews' => ReviewResource::collection($this->whenLoaded('approvedReviews')),
        ];
    }
}

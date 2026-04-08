<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
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
            'profile' => ProfileResource::make($this->profile),
            'doctor_profile' => [
                'id' => $doctorProfile?->id,
                'user_id' => $doctorProfile?->user_id,
                'specialization_id' => $doctorProfile?->specialization_id,
                'experience_years' => $doctorProfile?->experience_years,
                'bio' => $doctorProfile?->bio,
                'rating_avg' => $doctorProfile?->rating_avg,
                'specialization' => SpecializationResource::make($this->whenLoaded('doctorProfile', fn () => $doctorProfile?->specialization)),
            ],
            'specialization' => SpecializationResource::make($doctorProfile?->specialization),
            'experience_years' => $doctorProfile?->experience_years,
            'bio' => $doctorProfile?->bio,
            'rating_avg' => $doctorProfile?->rating_avg,
        ];
    }
}

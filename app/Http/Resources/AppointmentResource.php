<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'doctor' => UserResource::make($this->whenLoaded('doctor')),
            'patient' => UserResource::make($this->whenLoaded('patient')),
            'start_time' => $this->start_time->toIso8601String(),
            'end_time' => $this->end_time->toIso8601String(),
            'status' => $this->status->value,
            'diagnosis' => $this->diagnosis,
            'prescriptions' => PrescriptionResource::collection($this->whenLoaded('prescriptions')),
            'review' => ReviewResource::make($this->whenLoaded('review')),
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}

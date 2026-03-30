<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrescriptionResource extends JsonResource
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
            'appointment_id' => $this->appointment_id,
            'medicine_name' => $this->medicine_name,
            'dosage' => $this->dosage,
            'instructions' => $this->instructions,
            'duration' => $this->duration,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}

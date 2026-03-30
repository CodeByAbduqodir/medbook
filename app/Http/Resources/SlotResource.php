<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SlotResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    /**
     * @param  array{start_time: string, end_time: string, is_available: bool}  $resource
     */
    public function toArray(Request $request): array
    {
        return [
            'start_time' => $this->resource['start_time'],
            'end_time' => $this->resource['end_time'],
            'is_available' => $this->resource['is_available'],
        ];
    }
}

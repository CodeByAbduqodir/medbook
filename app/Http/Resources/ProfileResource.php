<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfileResource extends JsonResource
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
            'phone' => $this->phone,
            'birth_date' => $this->birth_date?->toDateString(),
            'address' => $this->address,
            'avatar_url' => $this->avatar ? asset('storage/'.$this->avatar) : null,
        ];
    }
}

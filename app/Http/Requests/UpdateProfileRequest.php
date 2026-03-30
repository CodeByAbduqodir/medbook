<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'birth_date' => ['sometimes', 'nullable', 'date', 'before:today'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'avatar' => ['sometimes', 'nullable', 'image', 'max:2048'],
        ];
    }
}

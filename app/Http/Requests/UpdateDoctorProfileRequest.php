<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDoctorProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'specialization_id' => ['sometimes', 'integer', 'exists:specializations,id'],
            'experience_years' => ['sometimes', 'integer', 'min:0', 'max:60'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:5000'],
        ];
    }
}

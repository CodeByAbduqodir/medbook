<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePrescriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'medicine_name' => ['required', 'string', 'max:255'],
            'dosage' => ['required', 'string', 'max:255'],
            'instructions' => ['required', 'string'],
            'duration' => ['required', 'string', 'max:255'],
        ];
    }
}

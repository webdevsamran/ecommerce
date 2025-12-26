<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:shipping,billing',
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'street' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'state' => 'nullable|string|max:100',
            'zip' => 'required|string|max:20',
            'country' => 'required|string|max:100',
            'is_default' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Please enter a name for this address.',
            'street.required' => 'Street address is required.',
            'city.required' => 'City is required.',
            'zip.required' => 'ZIP/Postal code is required.',
            'country.required' => 'Country is required.',
        ];
    }
}

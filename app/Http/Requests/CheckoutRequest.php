<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'shipping_address_id' => 'nullable|exists:addresses,id',
            'payment_method' => 'required|string|in:' . implode(',', array_keys(config('shop.payment_methods', []))),
            'notes' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'payment_method.required' => 'Please select a payment method.',
            'payment_method.in' => 'Invalid payment method selected.',
            'notes.max' => 'Order notes cannot exceed 500 characters.',
        ];
    }
}

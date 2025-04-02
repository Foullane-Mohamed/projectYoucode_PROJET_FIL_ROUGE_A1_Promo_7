<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CouponRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // We'll handle proper authorization later
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'code' => 'required|string|max:50',
            'discount' => 'required|numeric|min:0',
            'type' => 'required|in:percentage,fixed',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'boolean',
        ];
        
        if ($this->isMethod('post')) {
            $rules['code'] = 'required|string|max:50|unique:coupons,code';
        }
        
        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['code'] = 'required|string|max:50|unique:coupons,code,' . $this->route('id');
        }
        
        return $rules;
    }
}
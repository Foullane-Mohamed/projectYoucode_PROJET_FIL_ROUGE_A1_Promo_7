<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'role_id' => 'required|exists:roles,id',
        ];

        if ($this->isMethod('post')) {
            $rules['email'] = 'required|string|email|max:255|unique:users,email';
            $rules['password'] = 'required|string|min:8|confirmed';
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['email'] = 'required|string|email|max:255|unique:users,email,' . $this->route('id');
            $rules['password'] = 'nullable|string|min:8|confirmed';
        }
        
        return $rules;
    }
}
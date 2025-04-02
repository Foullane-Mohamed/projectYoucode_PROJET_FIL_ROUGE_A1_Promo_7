<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoleRequest extends FormRequest
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
            'description' => 'nullable|string',
        ];

        if ($this->isMethod('post')) {
            $rules['name'] = 'required|string|max:255|unique:roles,name';
        }

        if ($this->isMethod('put') || $this->isMethod('patch')) {
            $rules['name'] = 'required|string|max:255|unique:roles,name,' . $this->route('id');
        }
        
        return $rules;
    }
}
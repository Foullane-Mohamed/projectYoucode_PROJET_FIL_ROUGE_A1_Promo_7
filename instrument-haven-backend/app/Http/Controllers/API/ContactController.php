<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Mail\ContactFormMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    public function sendContactForm(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            Mail::to(config('mail.from.address'))->send(new ContactFormMail($request->all()));
            return response()->json(['message' => 'Contact form submitted successfully']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to send contact form', 'error' => $e->getMessage()], 500);
        }
    }
}
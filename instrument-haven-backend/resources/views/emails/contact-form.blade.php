@component('mail::message')
# New Contact Form Submission

**From:** {{ $name }} ({{ $email }})  
**Subject:** {{ $subject }}

## Message Content:
{{ $messageContent }}

@component('mail::button', ['url' => config('app.url')])
View Website
@endcomponent

Thank you,<br>
{{ config('app.name') }}
@endcomponent

@component('mail::message')
# Introduction
El cliente ha visto este presupuesto.

@component('mail::button', ['url' => url('/admin/estimates/'.$data['estimate']['id'].'/view')])
Presupuesto
@endcomponent

Gracias,<br>
{{ config('app.name') }}
@endcomponent

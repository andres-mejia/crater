@component('mail::message')
# Introduction
El cliente ha visto esta factura.

@component('mail::button', ['url' => url('/admin/invoices/'.$data['invoice']['id'].'/view')])
Factura
@endcomponent

Gracias,<br>
{{ config('app.name') }}
@endcomponent

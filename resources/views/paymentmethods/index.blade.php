@extends('layouts.admin')

@section('added-css')

@endsection

@section('content-header')
    <section class="content-header">
        <h1>
            Configuración
            <small>Medios de pago</small>
        </h1>
        <ol class="breadcrumb">
            <li><a href="/"><i class="fa fa-dashboard"></i> Inicio</a></li>
            <li class="active">Configuración</li>
            <li class="active">Medios de pago</li>
        </ol>
    </section>
@endsection

@section('content')

    <div id="PaymentMethods"></div>

@endsection

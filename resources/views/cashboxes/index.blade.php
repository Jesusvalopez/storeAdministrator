@extends('layouts.admin')

@section('added-css')

@endsection

@section('content-header')
    <section class="content-header">
        <h1>
            Caja
            <small>Detalle de caja</small>
        </h1>
        <ol class="breadcrumb">
            <li><a href="/"><i class="fa fa-dashboard"></i> Inicio</a></li>
            <li class="active">Caja</li>
            <li class="active">Detalle de caja</li>
        </ol>
    </section>
@endsection

@section('content')

    <div id="cashboxes"></div>

@endsection

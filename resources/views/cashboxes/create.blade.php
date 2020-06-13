@extends('layouts.admin')

@section('added-css')

@endsection

@section('content-header')
    <section class="content-header">
        <h1>
            Caja
            <small>Apertura o cierre de caja</small>
        </h1>
        <ol class="breadcrumb">
            <li><a href="/"><i class="fa fa-dashboard"></i> Inicio</a></li>
            <li class="active">Caja</li>
            <li class="active">Apertura o cierre de caja</li>
        </ol>
    </section>
@endsection

@section('content')

    <div id="cashboxes"></div>

@endsection

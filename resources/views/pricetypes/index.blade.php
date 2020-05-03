@extends('layouts.admin')

@section('added-css')

@endsection

@section('content-header')
    <section class="content-header">
        <h1>
            Configuración
            <small>Tipos de precios</small>
        </h1>
        <ol class="breadcrumb">
            <li><a href="/"><i class="fa fa-dashboard"></i> Inicio</a></li>
            <li class="active">Configuración</li>
            <li class="active">Tipos de precios</li>
        </ol>
    </section>
@endsection

@section('content')

    <form action="">
        @method('delete')
    </form>

    <div id="PriceTypes"></div>

@endsection

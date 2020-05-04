@extends('layouts.admin')

@section('added-css')

@endsection

@section('content-header')
    <section class="content-header">
        <h1>
            Productos
            <small>Listado</small>
        </h1>
        <ol class="breadcrumb">
            <li><a href="/"><i class="fa fa-dashboard"></i> Inicio</a></li>
            <li class="active">Productos</li>
            <li class="active">Listado de productos</li>
        </ol>
    </section>
@endsection

@section('content')

    <div id="productsList"></div>

@endsection

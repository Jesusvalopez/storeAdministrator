@extends('layouts.admin')

@section('added-css')

@endsection

@section('content-header')
    <section class="content-header">
        <h1>
            Ventas
            <small>Detalle de ventas</small>
        </h1>
        <ol class="breadcrumb">
            <li><a href="/"><i class="fa fa-dashboard"></i> Inicio</a></li>
            <li class="active">Ventas</li>
            <li class="active">Detalle de ventas</li>
        </ol>
    </section>
@endsection

@section('content')

    <div id="salesList"></div>

@endsection

@section('added-js')
    <script >
        SHOW_FILTERS = {!! $can_filter !!};

    </script>
@endsection

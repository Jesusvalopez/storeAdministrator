@extends('layouts.admin')

@section('added-css')

@endsection

@section('content-header')
    <section class="content-header">
        <h1>
            Gastos
            <small>Detalle de gastos</small>
        </h1>
        <ol class="breadcrumb">
            <li><a href="/"><i class="fa fa-dashboard"></i> Inicio</a></li>
            <li class="active">Gastos</li>
            <li class="active">Detalle de gastos</li>
        </ol>
    </section>
@endsection

@section('content')

    <div id="expensesList"></div>

@endsection

@section('added-js')
    <script >
        SHOW_FILTERS = {!! $can_filter !!};

    </script>
@endsection

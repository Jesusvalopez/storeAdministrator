<?php

namespace App\Http\Controllers;

use App\Cashbox;
use App\Policies\CashboxPolicy;
use Illuminate\Http\Request;

class CashBoxesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', Cashbox::class);

        return view('cashboxes.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Cashbox  $cashbox
     * @return \Illuminate\Http\Response
     */
    public function show(Cashbox $cashbox)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Cashbox  $cashbox
     * @return \Illuminate\Http\Response
     */
    public function edit(Cashbox $cashbox)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Cashbox  $cashbox
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Cashbox $cashbox)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Cashbox  $cashbox
     * @return \Illuminate\Http\Response
     */
    public function destroy(Cashbox $cashbox)
    {
        //
    }
}

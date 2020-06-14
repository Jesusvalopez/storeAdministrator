<?php

namespace App\Http\Controllers;

use App\Cashbox;
use App\CashboxDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        $this->authorize('create', Cashbox::class);

        //Obtener el ultimo cashbox del día

        $last_cashbox = Cashbox::latest()->first();

        $cashbox = new Cashbox();

        if($last_cashbox){

            if($last_cashbox->cashbox_type == Cashbox::APERTURA){
                $cashbox->cashbox_type = Cashbox::CIERRE;
                $cashbox->difference = 0;
            }else{
                $cashbox->cashbox_type = Cashbox::APERTURA;
                $cashbox->difference = 0;
            }

        }else{
            //No hay cajas registradas para el día, crear apertura
            $cashbox->cashbox_type = Cashbox::APERTURA;
            $cashbox->difference = 0;

        }

        $cashbox->user_id = Auth::user()->id;
        $cashbox->save();


        foreach ($request->all() as $value){

            $obj = json_decode(json_encode($value), FALSE);

        //\Log::info(json_encode($obj->total));

            $cashbox_detail = new CashboxDetail();
            $cashbox_detail->quantity = $obj->quantity;
            $cashbox_detail->cash_type = $obj->id;
            $cashbox->cashboxDetails()->save($cashbox_detail);

        }

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


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function listing()
    {
        $this->authorize('viewAny', Cashbox::class);

        $cashboxes = Cashbox::with(['cashboxDetails', 'seller'])->orderBy('id', 'desc')->get();

        return response()->json($cashboxes);
    }

}

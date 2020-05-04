<?php

namespace App\Http\Controllers;

use App\Discount;
use Illuminate\Http\Request;

class DiscountsController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $discount = Discount::orderBy('id', 'desc')->get();

        return response()->json($discount);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('viewAny', Discount::class);


        return view('discounts.index');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {


        $this->authorize('create', Discount::class);

        $discount = Discount::create(['name'=>$request->get('name'), 'quantity' => $request->get('quantity')]);


        return $discount;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Discount  $discount
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Discount $discount)
    {
        $this->authorize('view', $discount);

        return response()->json($discount);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Discount  $discount
     * @return \Illuminate\Http\Response
     */
    public function edit(Discount $discount)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Discount  $discount
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Discount $discount)
    {
        $this->authorize('update', $discount);

        $discount->name = $request->get('name');
        $discount->quantity = $request->get('quantity');
        $discount->save();

        $discounts = Discount::orderBy('id', 'desc')->get();

        return response()->json($discounts);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Discount  $discount
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Discount $discount)
    {
        $this->authorize('delete', $discount);

        $discount->delete();

        $discounts = Discount::orderBy('id', 'desc')->get();

        return response()->json($discounts);
    }
}

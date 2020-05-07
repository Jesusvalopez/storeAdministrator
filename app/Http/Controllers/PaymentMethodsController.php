<?php

namespace App\Http\Controllers;

use App\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodsController extends Controller
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $payment_method = PaymentMethod::orderBy('id', 'asc')->get();

        return response()->json($payment_method);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function create()
    {
        $this->authorize('viewAny', PaymentMethod::class);


        return view('paymentmethods.index');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->authorize('create', PaymentMethod::class);

        $payment_method = PaymentMethod::create(['name'=>$request->get('name'), 'comission' => $request->get('comission')]);


        return $payment_method;
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\PaymentMethod  $paymentMethod
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(PaymentMethod $paymentMethod)
    {
        $this->authorize('view', $paymentMethod);

        return response()->json($paymentMethod);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\PaymentMethod  $paymentMethod
     * @return \Illuminate\Http\Response
     */
    public function edit(PaymentMethod $paymentMethod)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\PaymentMethod  $paymentMethod
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $this->authorize('update', $paymentMethod);

        $paymentMethod->name = $request->get('name');
        $paymentMethod->comission = $request->get('comission');
        $paymentMethod->save();

        $paymentMethods = PaymentMethod::orderBy('id', 'desc')->get();

        return response()->json($paymentMethods);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\PaymentMethod  $paymentMethod
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(PaymentMethod $paymentMethod)
    {
        $this->authorize('delete', $paymentMethod);

        $paymentMethod->delete();

        $paymentMethods = PaymentMethod::orderBy('id', 'desc')->get();

        return response()->json($paymentMethods);
    }
}

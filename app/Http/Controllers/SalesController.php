<?php

namespace App\Http\Controllers;

use App\DiscountSale;
use App\DiscountSaleDetail;
use App\PaymentMethodSale;
use App\Sale;
use App\SaleDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SalesController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function create()
    {
        return view('sales.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $this->authorize('create', Sale::class);

        $products = $request->get('products');
        $payment_methods_sale = $request->get('payment_methods_sale');

        $sale = new Sale();
        $sale->user_id = Auth::user()->id;
        $sale->save();

        foreach ($products as $array){
            //\Log::info( $array);
            $obj = json_decode(json_encode($array), FALSE);
            $saleDetail = new SaleDetail();
            $saleDetail->quantity = $obj->quantity;
            $saleDetail->price_product_id = $obj->product_price_type_id;

            $sale->saleDetails()->save($saleDetail);

            foreach ($obj->discounts as $discount){
                    $discountSale = new DiscountSaleDetail();
                    $discountSale->discount_id = $discount->id;
                    $saleDetail->discountSaleDetails()->save($discountSale);


            }


        }

        foreach ($payment_methods_sale as $array){

            $obj = json_decode(json_encode($array), FALSE);

            $payment_method_sale = new PaymentMethodSale();
            $payment_method_sale->amount = $obj->quantity;
            $payment_method_sale->payment_method_id = $obj->payment_method->id;
            $sale->paymentMethodSale()->save($payment_method_sale);


        }


        return response()->json([$sale]);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Sale  $sale
     * @return \Illuminate\Http\Response
     */
    public function show(Sale $sale)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Sale  $sale
     * @return \Illuminate\Http\Response
     */
    public function edit(Sale $sale)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Sale  $sale
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Sale $sale)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Sale  $sale
     * @return \Illuminate\Http\Response
     */
    public function destroy(Sale $sale)
    {
        //
    }
}

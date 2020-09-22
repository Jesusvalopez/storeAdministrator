<?php

namespace App\Http\Controllers;


use App\ExpenseProduct;
use App\Http\Requests\ExpenseRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseProductsController extends Controller
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
        $this->authorize('viewAny', ExpenseProduct::class);

        $expenseProducts = ExpenseProduct::orderBy('id', 'desc')->limit(10)->get();

        return response()->json($expenseProducts);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function listingDate(Request $request)
    {
        $start_date =  $request->get('start_date');
        $end_date =  $request->get('end_date');

        $this->authorize('viewAny', Sale::class);
        $sales = Sale::with(['saleDetails.price.priceType','saleDetails.price.priceable','saleDetails.discountSaleDetails.discount', 'paymentMethodSale.paymentMethod', 'seller'])
            ->whereRaw("created_at::date BETWEEN '".$start_date."' and '".$end_date."'")->orderBy('id', 'desc')->get();

        return response()->json($sales);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function listing()
    {
        $this->authorize('viewAny', Sale::class);
        $sales = Sale::with(['saleDetails.price.priceType','saleDetails.price.priceable','saleDetails.discountSaleDetails.discount', 'paymentMethodSale.paymentMethod', 'seller'])
            ->whereRaw("created_at::date = '". date('Y-m-d')."'")->orderBy('id', 'desc')->get();

        return response()->json($sales);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function create()
    {
        $this->authorize('create', ExpenseProduct::class);

        return view('expense_products.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(ExpenseRequest $request)
    {
        $this->authorize('create', ExpenseProduct::class);

        //validar unique name


        $expenseProduct = new ExpenseProduct();
        $expenseProduct->name = $request->get('name');
        $expenseProduct->price = $request->get('price');
        $expenseProduct->description = $request->get('description');

        $expenseProduct->save();

        //$expenseProducts = ExpenseProduct::all();

        return response()->json($expenseProduct);
/*
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
            $saleDetail->price_id = $obj->product_price_type_id;

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
*/

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


    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function reports()
    {
        $this->authorize('viewAny', Sale::class);

        return view('sales.reports');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function reportsByDate(Request $request)
    {
        $start_date =  $request->get('start_date');
        $end_date =  $request->get('end_date');

        $this->authorize('viewAny', Sale::class);
        $sales = Sale::with(['saleDetails.price.priceType','saleDetails.price.priceable','saleDetails.discountSaleDetails.discount', 'paymentMethodSale.paymentMethod', 'seller'])
            ->whereRaw("created_at::date BETWEEN '".$start_date."' and '".$end_date."'")->orderBy('created_at', 'asc')->get();
        $sales_orderBy = $sales->groupBy('date');

        return response()->json(["sales"=>$sales, "salesOrderBy"=>$sales_orderBy]);
    }

}

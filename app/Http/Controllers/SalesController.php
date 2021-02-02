<?php

namespace App\Http\Controllers;

use App\Cashbox;
use App\DiscountSale;
use App\DiscountSaleDetail;
use App\DTE;
use App\Expense;
use App\ExpenseDetail;
use App\PaymentMethodSale;
use App\Sale;
use App\SaleDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class SalesController extends Controller
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
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $this->authorize('viewAny', Sale::class);

        //TODO Cambiar este rol
        $can_filter = Auth::user()->can('create products') ? 1 : 0;

        return view('sales.index')->with('can_filter', $can_filter);
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
        $sales = Sale::with(['dtes' => function($query){$query->where('type_id', DTE::BOLETA_ELECTRONICA);}])->with(['saleDetails.price.priceType','saleDetails.price.priceable','saleDetails.discountSaleDetails.discount', 'paymentMethodSale.paymentMethod', 'seller'])
            ->whereRaw("created_at::date BETWEEN '".$start_date."' and '".$end_date."'")->orderBy('id', 'desc')->get();


        $expenses = Expense::with(['expenseDetails','expenseDetails.price'])->whereBetween("expense_date",[$start_date,$end_date])->get();

        $total_expenses = 0;

        foreach ($expenses as $expense){
            foreach ($expense->expenseDetails as $expense_detail)
            $total_expenses += $expense_detail->quantity * $expense_detail->price->price;
        }

        return response()->json(["sales" => $sales, "expenses" => $total_expenses]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function listing()
    {
        $this->authorize('viewAny', Sale::class);
        $sales = Sale::with(['dtes' => function($query){$query->where('type_id', DTE::BOLETA_ELECTRONICA);}])->with(['saleDetails.price.priceType','saleDetails.price.priceable','saleDetails.discountSaleDetails.discount', 'paymentMethodSale.paymentMethod', 'seller'])
            ->whereRaw("created_at::date = '". date('Y-m-d')."'")->orderBy('id', 'desc')->get();

        $expenses = Expense::with(['expenseDetails','expenseDetails.price'])->where("expense_date", date('Y-m-d'))->get();

        $total_expenses = 0;

        foreach ($expenses as $expense){
            foreach ($expense->expenseDetails as $expense_detail)
                $total_expenses += $expense_detail->quantity * $expense_detail->price->price;
        }

        return response()->json(["sales" => $sales, "expenses" => $total_expenses]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function create()
    {
        $this->authorize('create', Sale::class);


        $last_cashbox = Cashbox::latest()->first();

        if($last_cashbox){
            if($last_cashbox->cashbox_type == Cashbox::APERTURA){
                return view('sales.create');
            }else{
                return view('sales.open_cashbox');
            }
        }

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
            $saleDetail->price_id = $obj->product_price_type_id;

            $sale->saleDetails()->save($saleDetail);

            foreach ($obj->discounts as $discount){
                    $discountSale = new DiscountSaleDetail();
                    $discountSale->discount_id = $discount->id;
                    $saleDetail->discountSaleDetails()->save($discountSale);

            }


        }

        $totals = [];

        $totals['MntTotal'] = 0;

        $billeable = false;
        $no_billeable = false;

        foreach ($payment_methods_sale as $array){

            $obj = json_decode(json_encode($array), FALSE);

            $payment_method_sale = new PaymentMethodSale();
            $payment_method_sale->amount = $obj->quantity;
            $payment_method_sale->payment_method_id = $obj->payment_method->id;
            $sale->paymentMethodSale()->save($payment_method_sale);

            if(PaymentMethodSale::isBilleable($obj->payment_method->name)){
                $billeable = true;
                $totals['MntTotal'] = $totals['MntTotal'] + $obj->quantity;

            }else{
                $no_billeable = true;
            }

        }

        try{
        if($totals['MntTotal'] > 0){

            $totals["MntNeto"] = intval(round($totals['MntTotal'] / Sale::IVA));
            $totals["IVA"] = $totals['MntTotal'] - $totals["MntNeto"];

            $products_billables = $request->get('products_billable_details');

            $details = [];

            foreach ($products_billables as $product_billable_raw){

                $product_billable = json_decode(json_encode($product_billable_raw), FALSE);

                $product_billable_array = [];

                    $product_billable_array["PrcItem"] = $product_billable->unit_price;
                    $product_billable_array["MontoItem"] = $product_billable->final_price;

                $product_billable_array["NroLinDet"] = $product_billable->line;
                $product_billable_array["NmbItem"] = $product_billable->name;
                $product_billable_array["QtyItem"] = $product_billable->quantity;



                array_push($details, $product_billable_array);
            }

            if($no_billeable && $billeable){
                $default_array = [];

                $default_array["NroLinDet"] = 1;
                $default_array["NmbItem"] = "Pago efectivo";
                $default_array["QtyItem"] = 1;
                $default_array["PrcItem"] = $totals['MntTotal'];
                $default_array["MontoItem"] = $totals['MntTotal'];

                $details = [];

                array_push($details, $default_array);
            }

        $response = Http::withHeaders([
            'apikey' => env('OPENFACTURA_API_KEY'),
            "Idempotency-Key" => $sale->id,
            'Content-Type' => 'application/json'
        ])->post(env('OPENFACTURA_PROD_URL').'/v2/dte/document', [
            'response' => ["PDF", "80MM"],
            'dte' => ["Encabezado" => ["IdDoc"=>["TipoDTE"=>39, "Folio"=> 0, "FchEmis"=>date("Y-m-d"), "IndServicio" => 3],
                "Emisor"=>["RUTEmisor" => "77044784-4","RznSocEmisor" => "STICKS SPA","GiroEmisor" => "Elaboracion, coccion y venta de alimentos","CdgSIISucur" => "83702210","DirOrigen" => "PRESIDENTE BALMACEDA 1232 3, Santiago","CmnaOrigen" => "Santiago",],
                "Receptor" => ["RUTRecep" => "66666666-6"],
                "Totales" => ["MntNeto" =>  $totals["MntNeto"], "IVA" => $totals["IVA"], "MntTotal" => $totals['MntTotal']]],
                "Detalle" => $details
            ],
        ]);


            \Log::info($response);



        $response_decoded = json_decode($response);

        $dte = new DTE();
        $dte->type_id = DTE::BOLETA_ELECTRONICA;
        $dte->token =  $response['TOKEN'];

        $sale->dtes()->save($dte);

        return response()->json(["billeable" => true, "response" => $response_decoded, "pdf" => isset($response['PDF']) ? $response['PDF'] : null ]);

        }
        }catch (\Exception $exception){

        }

        return response()->json(["billeable" => false]);
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
        $sale->delete();

        $sales = Sale::with(['saleDetails.price.priceType','saleDetails.price.priceable','saleDetails.discountSaleDetails.discount', 'paymentMethodSale.paymentMethod', 'seller'])
            ->whereRaw("created_at::date = '". date('Y-m-d')."'")->orderBy('id', 'desc')->get();

        $expenses = Expense::with(['expenseDetails','expenseDetails.price'])->where("expense_date", date('Y-m-d'))->get();

        $total_expenses = 0;

        foreach ($expenses as $expense){
            foreach ($expense->expenseDetails as $expense_detail)
                $total_expenses += $expense_detail->quantity * $expense_detail->price->price;
        }

        return response()->json(["sales" => $sales, "expenses" => $total_expenses]);

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

    public function getDteByToken($token){
        $response = Http::withHeaders([
            'apikey' => env('OPENFACTURA_API_KEY'),

            'Content-Type' => 'application/json'
            ])->get(env('OPENFACTURA_PROD_URL').'/v2/dte/document/'.$token.'/pdf');
       // ])->get('https://dev-api.haulmer.com/v2/dte/document/76795561-8/39/94418/pdf');
        //   \Log::info($response);
        //  \Log::info($response['pdf']);

        return response()->json(["pdf"=>$response['pdf']]);
    }
    public function dailyCashTotal(){

        $cashbox = Cashbox::with(['cashboxDetails', 'seller'])->orderBy('id', 'desc')->first();

        $cashbox_total = $cashbox ? $cashbox->cashboxTotal() : 0;

        //last cash sales
        if($cashbox){
        $last_cash_sales_total = PaymentMethodSale::whereHas('paymentMethod', function($query){
            $query->where('name', 'like', '%Efectivo%');
        })->where("created_at",">", $cashbox->created_at)->sum('amount');
        }else{
            $last_cash_sales_total = 0;
        }



        return response()->json(["last_cash_sales" => $last_cash_sales_total, "last_cashbox_total" => $cashbox_total]);


    }

}

<?php

namespace App\Http\Controllers;

use App\DiscountSale;
use App\DiscountSaleDetail;
use App\Expense;
use App\ExpenseDetail;
use App\PaymentMethodSale;
use App\Sale;
use App\SaleDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
        $sales = Sale::with(['saleDetails.price.priceType','saleDetails.price.priceable','saleDetails.discountSaleDetails.discount', 'paymentMethodSale.paymentMethod', 'seller'])
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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function create()
    {
        $this->authorize('create', Sale::class);

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

}

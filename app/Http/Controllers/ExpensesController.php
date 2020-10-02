<?php

namespace App\Http\Controllers;

use App\Expense;
use App\ExpenseDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpensesController extends Controller
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
        $this->authorize('viewAny', Expense::class);

        $expenses = Expense::with(['expenseDetails.product'])->orderBy('id', 'desc')->limit(10)->get();

        return response()->json($expenses);
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
        $this->authorize('create', Expense::class);

        return view('expenses.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $this->authorize('create', Expense::class);

        $expense = new Expense();
        $expense->expense_date = $request->get('start_date');
        $expense->payment_method_id = 1; //TODO cambiar por el adecuado
        $expense->save();

        $expense_detail = new ExpenseDetail();
        $expense_detail->quantity = $request->get('quantity');
        $expense_detail->product_id = $request->get('selected_value');

        $expense->expenseDetails()->save($expense_detail);

        $expense->expenseDetails->map(function ($expenseDetail){
            $expenseDetail->product;
        });

        return response()->json($expense);
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
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Expense $expense)
    {

        $this->authorize('delete', $expense);

        $expense->delete();

        //$expenses = Expense::orderBy('id', 'desc')->get();
        $expenses = Expense::with(['expenseDetails.product'])->orderBy('id', 'desc')->limit(20)->get();


        return response()->json($expenses);

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

<?php

namespace App\Http\Controllers;


use App\ExpenseProduct;
use App\Http\Requests\ExpenseRequest;
use App\Price;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExpenseProductsController extends Controller
{

    private $limit = 100;

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

        $expenseProducts = ExpenseProduct::orderBy('id', 'desc')->limit($this->limit)->get();

        return response()->json($expenseProducts);
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

        $price = new Price();
        $price->price_type_id = 1; //Siempre uno porque aca no importa el tipo de precio
        $price->price = $request->get('price');
        $price->is_current_price = true;

        $expenseProduct->prices()->save($price);

        //$expenseProducts = ExpenseProduct::all();
        $expenseProduct->load('prices');
        return response()->json($expenseProduct);


    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Sale  $sale
     * @return \Illuminate\Http\Response
     */
    public function show(ExpenseProduct $expenseProduct)
    {
        $this->authorize('view', $expenseProduct);

        $expenseProduct->load('prices');

        return response()->json($expenseProduct);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Sale  $sale
     * @return \Illuminate\Http\Response
     */
    public function edit(ExpenseProduct $expenseProduct)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Sale  $sale
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, ExpenseProduct $expenseProduct)
    {
        $this->authorize('update', $expenseProduct);

        $expenseProduct->name = $request->get('name');
        $expenseProduct->description = $request->get('description');
        $expenseProduct->price = $request->get('price');
        $expenseProduct->save();


        $price_type_id = 1;

        $price_type_exists = true;

        $price_value = $request->get('price');

        foreach ($expenseProduct->prices as $price){

            //Son el mismo tipo de precio
            if($price->price_type_id == $price_type_id){

                //Marcamos que tipo de precio existe para que no cree otro
                $price_type_exists = false;

                //Si tienen distinto valor de precio, marco como falso el anterior y creo uno nuevo.
                //De lo contrario no hay que hacer nada, el precio no debe ser actualizado
                if(!($price_value == $price->price)){
                    $price->is_current_price = false;
                    $price->save();

                    $price = new Price();
                    $price->price_type_id = $price_type_id;
                    $price->price = $price_value;
                    $price->is_current_price = true;

                    $expenseProduct->prices()->save($price);

                }
            }

        }

        //Si el tipo de precio no se encontró en la lista, es uno nuevo y hay que crearlo
        if($price_type_exists){

            $price = new Price();
            $price->price_type_id = $price_type_id;
            $price->price = $price_value;
            $price->is_current_price = true;

            $expenseProduct->prices()->save($price);

        }





        $expenseProducts = ExpenseProduct::with('prices')->orderBy('id', 'desc')->limit($this->limit)->get();

        return response()->json($expenseProducts);
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

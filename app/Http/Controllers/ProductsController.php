<?php

namespace App\Http\Controllers;

use App\Bundle;
use App\Price;
use App\Product;
use App\SaleDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductsController extends Controller
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
      //  $this->authorize('viewAny', Product::class);

        $products = Product::with('price.priceType')->orderBy('id', 'desc')->get();

        return response()->json($products);
    }

    public function listing(){
        $this->authorize('viewAny', Product::class);

        $products = Product::with('price.priceType')->orderBy('id', 'desc')->get();
        $bundles = Bundle::with('price.priceType')->orderBy('id', 'desc')->get();

        return response()->json(array_merge($products,$bundles));
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

        $this->authorize('create', Product::class);

        $can_create = Auth::user()->can('create products') ? 1 : 0;
        $can_list = Auth::user()->can('view products') ? 1 : 0;

        return view('products.create')->with(['can_create' => $can_create, 'can_list' => $can_list]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $this->authorize('create', Product::class);

        $product = new Product();
        $product->name = $request->get('name');
        $product->description = $request->get('description');
        $product->stock = $request->get('stock');
        $product->save();


        foreach ($request->except(['name', 'description','stock']) as $key => $value){

            $price = new Price();
            $price->price_type_id = str_replace('price_', '', $key);
            $price->price = $value;
            $price->is_current_price = true;

            $product->price()->save($price);

        }


       // $prduct->load('price');
        return response()->json($product);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Product $product)
    {
        $this->authorize('view', $product);

        $product->load('price.priceType');


        return response()->json($product);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Product $product)
    {

        $this->authorize('update', $product);

        $product->name = $request->get('name');
        $product->description = $request->get('description');
        $product->stock = $request->get('stock');
        $product->save();


          foreach ($request->except(['name', 'description','stock']) as $key => $value){

              $price_type_id = str_replace('price_', '', $key);

              $price_type_exists = true;

              foreach ($product->price as $price){

                  //Son el mismo tipo de precio
                  if($price->price_type_id == $price_type_id){

                      //Marcamos que tipo de precio existe para que no cree otro
                      $price_type_exists = false;

                      //Si tienen distinto valor de precio, marco como falso el anterior y creo uno nuevo.
                      //De lo contrario no hay que hacer nada, el precio no debe ser actualizado
                      if(!($value == $price->price)){
                          $price->is_current_price = false;
                          $price->save();

                          $price = new Price();
                          $price->price_type_id = $price_type_id;
                          $price->price = $value;
                          $price->is_current_price = true;

                          $product->price()->save($price);

                      }
                  }

              }

              //Si el tipo de precio no se encontró en la lista, es uno nuevo y hay que crearlo
              if($price_type_exists){

                  $price = new Price();
                  $price->price_type_id = $price_type_id;
                  $price->price = $value;
                  $price->is_current_price = true;

                  $product->price()->save($price);

              }


          }

        $product->load('price');
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Product $product)
    {
        $this->authorize('delete', $product);

        $product->delete();

        $products = Product::orderBy('id', 'desc')->get();

        return response()->json($products);
    }

    public function bestSellers(){

        $this->authorize('viewAny', Product::class);



        $best_sellers = SaleDetail::with(['price', 'price.priceable', 'price.priceType'])
            ->whereBetween('created_at', [date("Y-m-d", strtotime("-1 months")),date('Y-m-d', strtotime("+1 days"))])
            ->orderBy('id', 'desc')->get();


        $products = [];

        foreach ($best_sellers as $key => $best_seller){

            $name = $best_seller->price->priceable->name;
            //buscar nombre

            if(array_key_exists($name,$products)){
                //si encuentro el nombre sumo.
                $products[$name]->quantity +=  $best_seller->quantity;
            }else{

                //si no encuentro el nombre
                $info = new \stdClass();
                $info->name = $name;
                $info->quantity = $best_seller->quantity;
                $info->prices = $best_seller->price->priceable->price;

                $products[$name] = $info;

            }

        }


        $quantity = array_column($products, 'quantity');

        array_multisort($quantity, SORT_DESC, $products);
     //   $best_sellers = Product::with(['price', 'price.saleDetails'])->limit(10)->get();

        $array_products = [];

        $count = 0;
        foreach ($products as $key => $product){

            if($count == 10){
                break;
            }
            $array_p = (array) $product;

            array_push($array_products, $array_p);

            $count++;

        }

        return response()->json($array_products);


    }
}

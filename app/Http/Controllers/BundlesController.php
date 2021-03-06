<?php

namespace App\Http\Controllers;

use App\Bundle;
use App\Price;
use App\Product;
use Illuminate\Http\Request;

class BundlesController extends Controller
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
       // $this->authorize('viewAny', Bundle::class);

        $bundles = Bundle::with(['price.priceType', 'products'])->orderBy('id', 'desc')->get();

        return response()->json($bundles);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $this->authorize('create', Bundle::class);

        $bundle = new Bundle();
        $bundle->name = $request->get('name');
        $bundle->description = $request->get('description');
        $bundle->save();


        foreach ($request->except(['name', 'description', 'products_to_bundle']) as $key => $value){

            $price = new Price();
            $price->price_type_id = str_replace('price_', '', $key);
            $price->price = $value;
            $price->is_current_price = true;
            $bundle->price()->save($price);

        }

        foreach ($request->get('products_to_bundle') as $array){

            $obj = json_decode(json_encode($array), FALSE);
            $product = Product::find($obj->product->id);
            $bundle->products()->save($product, ['quantity' => $obj->quantity]);

        }


        $bundle->load(['products', 'price']);
        return response()->json($bundle);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Bundle  $bundle
     * @return \Illuminate\Http\Response
     */
    public function show(Bundle $bundle)
    {
        $this->authorize('view', $bundle);

        $bundle->load('price.priceType');


        return response()->json($bundle);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Bundle  $bundle
     * @return \Illuminate\Http\Response
     */
    public function edit(Bundle $bundle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Bundle  $bundle
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Bundle $bundle)
    {
        $this->authorize('update', $bundle);

        $bundle->name = $request->get('name');
        $bundle->description = $request->get('description');

        $bundle->save();


        foreach ($request->except(['name', 'description']) as $key => $value){

            $price_type_id = str_replace('price_', '', $key);

            $price_type_exists = true;

            foreach ($bundle->price as $price){

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

                        $bundle->price()->save($price);

                    }
                }

            }

            //Si el tipo de precio no se encontró en la lista, es uno nuevo y hay que crearlo
            if($price_type_exists){

                $price = new Price();
                $price->price_type_id = $price_type_id;
                $price->price = $value;
                $price->is_current_price = true;

                $bundle->price()->save($price);

            }


        }

        $bundle->load(['products', 'price']);

        return response()->json($bundle);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Bundle  $bundle
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(Bundle $bundle)
    {
        $this->authorize('delete', $bundle);

        $bundle->delete();

        $bundles = Bundle::with(['price', 'products'])->orderBy('id', 'desc')->get();

        return response()->json($bundles);
    }
}

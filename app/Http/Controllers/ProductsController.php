<?php

namespace App\Http\Controllers;

use App\Bundle;
use App\Price;
use App\Product;
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
     * @return \Illuminate\Http\Response
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

            $product->price()->save($price);

        }



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
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Product $product)
    {

        $this->authorize('update', $product);
        /*
        $product->name = $request->get('name');
        $product->description = $request->get('description');
        $product->stock = $request->get('stock');
        $product->save();


        foreach ($request->except(['name', 'description','stock']) as $key => $value){

            $price = new Price();
            $price->price_type_id = str_replace('price_', '', $key);
            $price->price = $value;

            $product->price()->save($price);

        }
        */

        return response()->json([$request->all(), $product]);
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
}

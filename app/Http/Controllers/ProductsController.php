<?php

namespace App\Http\Controllers;

use App\PriceProduct;
use App\Product;
use Illuminate\Http\Request;

class ProductsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $this->authorize('viewAny', Product::class);

        $products = Product::orderBy('id', 'desc')->get();

        return response()->json($products);
    }

    public function listing(){
        $this->authorize('viewAny', Product::class);

        $products = Product::orderBy('id', 'desc')->get();

        return response()->json($products);
    }
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $this->authorize('create', Product::class);


        return view('products.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
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

            $priceProduct = new PriceProduct();
            $priceProduct->product_id = $product->id;
            $priceProduct->price_type_id = str_replace('price_', '', $key);
            $priceProduct->price = $value;
            $priceProduct->save();

        }



        return response()->json($product);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
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
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}

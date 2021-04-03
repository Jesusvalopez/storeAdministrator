<?php

namespace App\Http\Controllers;
use App\WoocommerceProduct;
use Codexshaper\WooCommerce\Facades\Order;

use Codexshaper\WooCommerce\Facades\Product;
use Codexshaper\WooCommerce\Facades\Variation;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;

class WoocommerceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('woocommerce.orders');
    }

    public function updateItems(Request $request){

        //actualizar primero en woocommerce y si todo ok, actualizar en mi base

        //woocommerce update

        //base update
        $status = $request->get('status');
        $items = $request->get('items');

        $data = [
            'update'    => [],
        ];

        $variations = [];

        foreach ($items as $item){

            $item_obj = json_decode(json_encode($item), FALSE);

            if(!$item_obj->woocommerce_parent_id){

                $data       = [
                    'stock_status'    => $status,
                ];

               Product::update($item_obj->woocommerce_id, $data);

                $product = WoocommerceProduct::find($item_obj->id);
                $product->stock_status = $status;
               $product->save();

            }else{

                $array = ["id" => $item_obj->woocommerce_id, 'stock_status' => $status];


                if(isset($variations[$item_obj->woocommerce_parent_id])){

                   array_push($variations[$item_obj->woocommerce_parent_id], $array );

                }else{
                    $variations[$item_obj->woocommerce_parent_id] =  [$array];
                }



            }

        }

        foreach ($variations as $key => $variation){

            $a = ['update'=> $variation];

            Variation::batch($key, $a);

            foreach ($variation as $v){
                $product = WoocommerceProduct::where('woocommerce_id',$v['id'])->first();
                $product->stock_status = $status;
                $product->save();
            }

        }

        $woocommerce_products = WoocommerceProduct::orderBy('id', 'asc')->get();

        return response()->json(['items' => $woocommerce_products]);



        /*
        $status = $request->get('status');
        $items = $request->get('items');

        foreach ($items as $item){

            $item_obj = json_decode(json_encode($item), FALSE);

            if(!$item_obj->woocommerce_parent_id){

                $data       = [
                    'stock_status'    => $status,
                ];

                 Product::update($item_obj->woocommerce_id, $data);

            }else{

                $data = [
                    'stock_status'    => $status,
                ];

                Variation::update($item_obj->woocommerce_parent_id, $item_obj->woocommerce_id, $data);


            }

            $product = WoocommerceProduct::find($item_obj->id);
            $product->stock_status = $status;
            $product->save();

        }

        $woocommerce_products = WoocommerceProduct::orderBy('id', 'asc')->get();

        return response()->json(['items' => $woocommerce_products]);
        */

    }


    public function syncItems(){

        $options = [
            'per_page' => 100 // Or your desire number
        ];



        $items = Product::all($options);



        foreach ($items as $item){

            $woocommerce_product = WoocommerceProduct::where('woocommerce_id', $item->id)->first();

            if(!$woocommerce_product){
                $woocommerce_product = new WoocommerceProduct();
                $woocommerce_product->woocommerce_id = $item->id;
            }

            $woocommerce_product->name = $item->name;
            $woocommerce_product->stock_status = $item->stock_status;
            $woocommerce_product->type = $item->type;
            $woocommerce_product->save();



            if($woocommerce_product->type == 'variable'){
                $variations = Variation::all($item->id, $options);

                foreach ($variations as $variation) {

                    $name = $item->name . ' - ';

                    $numItems = count($variation->attributes);
                    $i = 0;

                    foreach ($variation->attributes as $attribute) {

                        if (++$i === $numItems) {
                            $name .= $attribute->option;
                            break;
                        }

                        $name .= $attribute->option . ", ";

                    }

                    $variation->name = $name;

                    $woocommerce_product = WoocommerceProduct::where('woocommerce_id', $variation->id)->first();

                    if (!$woocommerce_product) {
                        $woocommerce_product = new WoocommerceProduct();
                        $woocommerce_product->woocommerce_id = $variation->id;
                    }

                    $woocommerce_product->name = $variation->name;
                    $woocommerce_product->stock_status = $variation->stock_status;
                    $woocommerce_product->type = "variable";
                    $woocommerce_product->woocommerce_parent_id = $item->id;
                    $woocommerce_product->save();

                }
            }




        }

        $woocommerce_products =  WoocommerceProduct::orderBy('id', 'asc')->get();

        return response()->json(['items' => $woocommerce_products]);


    }
    public function getItems(){

               $woocommerce_products =  WoocommerceProduct::orderBy('id', 'asc')->get();

               return response()->json(['items' => $woocommerce_products]);


    }
    public function items()
    {
        return view('woocommerce.items');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function orders()
    {

        $options = [
            'per_page' => 20 // Or your desire number
        ];

        $orders = Order::all($options);

        return response()->json(['orders' => $orders]);


    }

    public function finishOrders(Request $request){

        $order_id = $request->get('order_id');

        $data     = [
            'status' => 'completed',
        ];

        $response = Order::update($order_id, $data);

        $orders = Order::all();

        return response()->json(['response' => $response, 'orders' => $orders]);


    }



}

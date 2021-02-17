<?php

namespace App\Http\Controllers;
use Codexshaper\WooCommerce\Facades\Order;
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

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function orders()
    {


        $orders = Order::all();

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

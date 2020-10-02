<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\NewOrder;

class EventsController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function newOrder(Request $request)
    {
        //fb5ab8b4-d616-427d-8cdb-cf6a429dd5f2

        //\Log::info(json_encode($request->headers->get('api-key')));

        $order = $request->get('number');

        event(new NewOrder(["order_number" => $order, "url" => "https://sticks.cl/wp-admin/post.php?post=".$order."&action=edit"]));

      //  echo "orden enviada";
    }
}

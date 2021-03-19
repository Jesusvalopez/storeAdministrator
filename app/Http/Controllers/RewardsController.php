<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Http;

class RewardsController extends Controller
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


    public function getUserCoupons($client_id){

        $url = env('STICKS_REWARDS_URL') . "/v1/get-users-coupons/" . $client_id;

        $response = Http::withHeaders([
            'x-api-key' => env('STICKS_REWARDS_API_KEY'),
            'x-api-secret' =>  env('STICKS_REWARDS_API_SECRET')
        ])->get($url);



        return response()->json(["coupons" => $response["coupons"]]);

    }
    public function getUsers($email){


        $url = env('STICKS_REWARDS_URL') . "/v1/get-users/" . $email;
        \Log::info($url);

        $response = Http::withHeaders([
            'x-api-key' => env('STICKS_REWARDS_API_KEY'),
            'x-api-secret' =>  env('STICKS_REWARDS_API_SECRET')
        ])->get($url);

        \Log::info($response);

        return response()->json($response["users"]);
    }


}

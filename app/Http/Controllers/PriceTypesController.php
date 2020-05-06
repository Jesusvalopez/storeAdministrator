<?php

namespace App\Http\Controllers;

use App\PriceType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;


class PriceTypesController extends Controller
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
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $priceTypes = PriceType::orderBy('id', 'desc')->get();

        return response()->json($priceTypes);

    }

    public function create(){

        $this->authorize('viewAny', PriceType::class);


        return view('pricetypes.index');

    }

    public function store(Request $request){

        $this->authorize('create', PriceType::class);

        $priceType = PriceType::create(['name'=>$request->get('name'), 'status' => 1]);


        return $priceType;

    }

    public function destroy(PriceType $priceType){

        $this->authorize('delete', $priceType);

        $priceType->delete();

        $priceTypes = PriceType::orderBy('id', 'desc')->get();

        return response()->json($priceTypes);
    }

    public function show(PriceType $priceType){

        $this->authorize('view', $priceType);

        return response()->json($priceType);

    }

    public function update(PriceType $priceType, Request $request){

        $this->authorize('update', $priceType);

        $priceType->name = $request->get('name');
        $priceType->status = $request->get('status');
        $priceType->save();

        $priceTypes = PriceType::orderBy('id', 'desc')->get();

        return response()->json($priceTypes);

    }
}

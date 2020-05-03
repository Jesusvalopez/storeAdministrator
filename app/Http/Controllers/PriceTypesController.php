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
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $priceTypes = PriceType::all();

        return response()->json($priceTypes);

    }

    public function create(){

        $this->authorize('viewAny', PriceType::class);


        return view('pricetypes.index');

    }

    public function store(PriceType $priceType){

        $this->authorize('create', PriceType::class);

        return 'hola';

    }
}

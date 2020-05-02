<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class HomeController extends Controller
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
        //Role::create(['name' => 'Administrador']);
       // $role = Role::findById(1);
        //Permission::create(['name' => 'create price type']);
       // Permission::create(['name' => 'view price type']);
       // $role->givePermissionTo('view price type');
        //Auth::user()->givePermissionTo('create price type');

        return view('home');
    }
}

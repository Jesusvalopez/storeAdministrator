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
        /*
        Role::create(['name' => 'Administrador']);

        $role = Role::findById(1);
        Permission::create(['name' => 'create price type']);
        Permission::create(['name' => 'edit price type']);
        Permission::create(['name' => 'delete price type']);
        Permission::create(['name' => 'view price type']);
        $role->givePermissionTo('view price type');
        $role->givePermissionTo('create price type');
        $role->givePermissionTo('edit price type');
        $role->givePermissionTo('delete price type');

        Permission::create(['name' => 'create products']);
        Permission::create(['name' => 'view products']);
        Permission::create(['name' => 'edit products']);
        Permission::create(['name' => 'delete products']);
        $role->givePermissionTo('create products');
        $role->givePermissionTo('view products');
        $role->givePermissionTo('edit products');
        $role->givePermissionTo('delete products');
        Permission::create(['name' => 'create discounts']);
        Permission::create(['name' => 'edit discounts']);
        Permission::create(['name' => 'delete discounts']);
        Permission::create(['name' => 'view discounts']);
        $role->givePermissionTo('view discounts');
        $role->givePermissionTo('create discounts');
        $role->givePermissionTo('edit discounts');
        $role->givePermissionTo('delete discounts');
        Permission::create(['name' => 'create payment methods']);
        Permission::create(['name' => 'edit payment methods']);
        Permission::create(['name' => 'delete payment methods']);
        Permission::create(['name' => 'view payment methods']);
        $role->givePermissionTo('view payment methods');
        $role->givePermissionTo('create payment methods');
        $role->givePermissionTo('edit payment methods');
        $role->givePermissionTo('delete payment methods');

        $user = Auth::user();
        $user->assignRole('Administrador');
*/
        return view('home');
    }
}

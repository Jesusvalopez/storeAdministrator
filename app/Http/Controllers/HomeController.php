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
         Permission::create(['name' => 'create sales']);
        Permission::create(['name' => 'edit sales']);
        Permission::create(['name' => 'delete sales']);
        Permission::create(['name' => 'view sales']);
        $role->givePermissionTo('view sales');
        $role->givePermissionTo('create sales');
        $role->givePermissionTo('edit sales');
        $role->givePermissionTo('delete sales');

        Permission::create(['name' => 'create bundles']);
        Permission::create(['name' => 'edit bundles']);
        Permission::create(['name' => 'delete bundles']);
        Permission::create(['name' => 'view bundles']);
        $role->givePermissionTo('view bundles');
        $role->givePermissionTo('create bundles');
        $role->givePermissionTo('edit bundles');
        $role->givePermissionTo('delete bundles');

        Permission::create(['name' => 'create cashboxes']);
        Permission::create(['name' => 'edit cashboxes']);
        Permission::create(['name' => 'delete cashboxes']);
        Permission::create(['name' => 'view cashboxes']);
        $role->givePermissionTo('view cashboxes');
        $role->givePermissionTo('create cashboxes');
        $role->givePermissionTo('edit cashboxes');
        $role->givePermissionTo('delete cashboxes');


        $user = Auth::user();
        $user->assignRole('Administrador');
        */

/*
        $role = Role::create(['name' => 'Vendedor']);
        $role->givePermissionTo('create sales');
        $role->givePermissionTo('view sales');
        $user = Auth::user();
        $user->assignRole('Vendedor');
*/

/*CREAR ROLES GASTOS*/


/*
        Permission::create(['name' => 'create expenses']);
        Permission::create(['name' => 'edit expenses']);
        Permission::create(['name' => 'delete expenses']);
        Permission::create(['name' => 'view expenses']);

        $role = Role::findById(1);

        $role->givePermissionTo('create expenses');
        $role->givePermissionTo('edit expenses');
        $role->givePermissionTo('delete expenses');
        $role->givePermissionTo('view expenses');




                Permission::create(['name' => 'create expense products']);
                Permission::create(['name' => 'edit expense products']);
                Permission::create(['name' => 'delete expense products']);
                Permission::create(['name' => 'view expense products']);

             //   $role = Role::findById(1);

                $role->givePermissionTo('create expense products');
                $role->givePermissionTo('edit expense products');
                $role->givePermissionTo('delete expense products');
                $role->givePermissionTo('view expense products');
*/


        return view('home');
    }
}

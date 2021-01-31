<?php

namespace App\Http\Controllers;


use http\Client;
use http\Message\Body;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
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


//PARA EMITIR
/*
        $response = Http::withHeaders([
            'apikey' => '928e15a2d14d4a6292345f04960f4bd3',
        //    "Idempotency-Key" => 604,
            'Content-Type' => 'application/json'
    ])->post('https://dev-api.haulmer.com/v2/dte/document', [
            'response' => ["PDF", "80MM"],
            'dte' => ["Encabezado" => ["IdDoc"=>["TipoDTE"=>39, "Folio"=> 0, "FchEmis"=>"2021-01-30", "IndServicio" => 3],
                                        "Emisor"=>["RUTEmisor" => "76795561-8","RznSocEmisor" => "HAULMERSPA","GiroEmisor" => "VENTA AL POR MENOR EN EMPRESAS DE VENTA A DISTANCIA VÍA INTERNET","CdgSIISucur" => "81303347","DirOrigen" => "ARTURO PRAT 527 CURICO","CmnaOrigen" => "Curicó",],
                                        "Receptor" => ["RUTRecep" => "66666666-6"],
                                        "Totales" => ["MntNeto" => 3529, "IVA" => 671, "MntTotal" => 4200]],
"Detalle" => [["NroLinDet" => 1, "NmbItem" => "Empanada de queso", "QtyItem" => 2, "PrcItem" => 1500, "MontoItem" => 3000 ],
    ["NroLinDet" => 2, "NmbItem" => "Empanada de pollo", "QtyItem" => 1, "PrcItem" => 1200,  "MontoItem" => 1200 ]]
                    ],
        ]);

        \Log::info($response);
        $response_decoded = json_decode($response);


        return response()->json(["response" => $response_decoded, "pdf" => isset($response_decoded['PDF']) ? $response_decoded['PDF'] : null ]);


*/
/*
        $response = Http::withHeaders([
            'apikey' => '928e15a2d14d4a6292345f04960f4bd3',

            'Content-Type' => 'application/json'
     //   ])->get('https://dev-api.haulmer.com/v2/dte/document/4461982a5e131ab56d8f6b93cfc52f9163e44685a8056c029381dcbbbc9495d9/pdf');
        ])->get('https://dev-api.haulmer.com/v2/dte/document/76795561-8/39/94418/pdf');
     //   \Log::info($response);
      //  \Log::info($response['pdf']);

        return response()->json($response['pdf']);

        $data = base64_decode($response['pdf']);
        header('Content-Type: application/pdf');
        echo $data;

*/

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

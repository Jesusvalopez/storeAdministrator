<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/login');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');


Route::resource('price-types', 'PriceTypesController');
Route::resource('payment-methods', 'PaymentMethodsController');
//Route::get('/products-all', 'ProductsController@listing');
Route::resource('products', 'ProductsController');
Route::resource('bundles', 'BundlesController');
Route::resource('discounts', 'DiscountsController');
Route::get('/sales/listing', 'SalesController@listing');
Route::resource('sales', 'SalesController');



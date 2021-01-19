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
/*
Route::get('/date', function () {
     $date = new DateTime();
    echo $date->format('Y-m-d H:i:s');
    $tz  = date_timezone_get($date);
    echo timezone_name_get($tz);
    echo time();
    echo phpinfo();


});
*/
Route::get('/home', 'HomeController@index')->name('home');


Route::resource('price-types', 'PriceTypesController');
Route::resource('payment-methods', 'PaymentMethodsController');
//Route::get('/products-all', 'ProductsController@listing');
Route::get('/products/best-sellers', 'ProductsController@bestSellers');
Route::resource('products', 'ProductsController');
Route::resource('bundles', 'BundlesController');
Route::resource('discounts', 'DiscountsController');
Route::get('/sales/daily-cash-total', 'SalesController@dailyCashTotal');
Route::post('/sales/listing-date', 'SalesController@listingDate');
Route::post('/sales/reports-by-date', 'SalesController@reportsByDate');
Route::get('/sales/listing', 'SalesController@listing');
Route::get('/sales/reports', 'SalesController@reports')->name('sales.reports');;
Route::resource('sales', 'SalesController');
Route::resource('expenses', 'ExpensesController');
Route::resource('expense-products', 'ExpenseProductsController');
Route::get('/cashboxes/listing', 'CashBoxesController@listing');
Route::resource('cashboxes', 'CashBoxesController');



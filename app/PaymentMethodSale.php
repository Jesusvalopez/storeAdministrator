<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentMethodSale extends Model
{
    use SoftDeletes;

    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public static function isBilleable($name){

        return true;
        /*
        $billeables = ['Efectivo', 'Rappi', 'Pedidos Ya', 'Efectivo Pedidos Ya', 'Transferencia', 'FPay', 'Webpay Crédito', 'Webpay Débito', 'Crédito', 'Débito'];

        if(in_array($name, $billeables)){
            return true;
        }else{
            return false;
        }
*/

    }

}

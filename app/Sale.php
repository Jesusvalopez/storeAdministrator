<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function paymentMethodSale()
    {
        return $this->hasMany(PaymentMethodSale::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }


}

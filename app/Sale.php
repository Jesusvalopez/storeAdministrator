<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{

    use SoftDeletes;

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

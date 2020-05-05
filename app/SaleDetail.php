<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{


    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function discountSaleDetails()
    {
        return $this->hasMany(DiscountSaleDetail::class);
    }
}

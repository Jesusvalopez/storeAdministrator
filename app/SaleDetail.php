<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{


    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function priceProduct()
    {
        return $this->belongsTo(Price::class);
    }

    public function price()
    {
        return $this->belongsTo(Price::class);
    }
    public function discountSaleDetails()
    {
        return $this->hasMany(DiscountSaleDetail::class);
    }
}

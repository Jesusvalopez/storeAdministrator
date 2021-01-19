<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SaleDetail extends Model
{


    use SoftDeletes;

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

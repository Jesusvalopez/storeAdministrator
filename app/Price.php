<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function priceType()
    {
        return $this->belongsTo(PriceType::class);
    }

    public function priceable()
    {
        return $this->morphTo();
    }

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class);
    }
}

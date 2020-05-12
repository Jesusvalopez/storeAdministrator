<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    public function pricesTypes()
    {
        return $this->belongsToMany(PriceType::class, 'price_products')->withPivot('price', 'id')->as('prices');
    }

    public function price()
    {
        return $this->morphMany(Price::class, 'priceable')->where('is_current_price', true);
    }
}

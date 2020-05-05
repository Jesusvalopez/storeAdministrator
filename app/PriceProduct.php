<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PriceProduct extends Model
{
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

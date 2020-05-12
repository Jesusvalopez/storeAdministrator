<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bundle extends Model
{

    use SoftDeletes;

    public function price()
    {
        return $this->morphMany(Price::class, 'priceable')->where('is_current_price', true);
    }

    public function products(){
        return $this->belongsToMany(Product::class);
    }
}

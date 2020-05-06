<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bundle extends Model
{

    use SoftDeletes;

    public function price()
    {
        return $this->morphMany(Price::class, 'priceable');
    }

    public function products(){
        return $this->belongsToMany(Product::class);
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PriceType extends Model
{

    use SoftDeletes;

    protected $table = 'price_types';

    protected $fillable = ['name', 'status'];

}

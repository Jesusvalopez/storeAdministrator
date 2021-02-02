<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DTE extends Model
{

    use SoftDeletes;

    protected $table = 'dtes';

    const BOLETA_ELECTRONICA = 39;


}

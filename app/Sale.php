<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Sale extends Model
{

    use SoftDeletes;
    public  $timestamps = false;

    protected $appends = ['date', 'date_time'];

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class);
    }

    public function paymentMethodSale()
    {
        return $this->hasMany(PaymentMethodSale::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function getDateAttribute(){
        $date = date('d/m/y', strtotime($this->created_at));
        return $date;
    }


    public function getDateTimeAttribute(){
        $date = date('d/m/y H:i:s', strtotime($this->created_at));
        return $date;
    }


}

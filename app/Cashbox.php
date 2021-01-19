<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cashbox extends Model
{
    const APERTURA = 1;
    const CIERRE = 2;

    protected $appends = ['cashbox_type_name', 'date_time'];

    public function cashboxDetails()
    {
        return $this->hasMany(CashboxDetail::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function getCashboxTypeNameAttribute(){
        return $this->cashbox_type == self::APERTURA ? 'Apertura' : 'Cierre';

    }

    public function getDateTimeAttribute(){
        $date = date('d/m/y H:i:s', strtotime($this->created_at));
        return $date;
    }


    public function cashboxTotal(){

        $details = $this->cashboxDetails;

        $total = 0;

        foreach ($details as $detail){

            $total += $detail->total;

        }

        return $total;


    }

}

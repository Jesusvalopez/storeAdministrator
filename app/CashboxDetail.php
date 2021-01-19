<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class CashboxDetail extends Model
{

    protected $appends = ['total'];

    public function returnCashValue($cash_type){

        switch ($cash_type){
            case 1:{
                return 10;
            }
            case 2:{
                return 50;
            }
            case 3:{
                return 100;
            }
            case 4:{
                return 500;
            }
            case 5:{
                return 1000;
            }
            case 6:{
                return 2000;
            }
            case 7:{
                return 5000;
            }
            case 8:{
                return 10000;
            }
            case 9:{
                return 20000;
            }
        }

    }

    public function getTotalAttribute(){

        $total = 0;

        $currency_value = self::returnCashValue($this->cash_type);

        $total += $currency_value * $this->quantity;

        return $total;
    }
}

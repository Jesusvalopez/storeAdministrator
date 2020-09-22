<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{

    use SoftDeletes;

    //protected $appends = ['date', 'date_time'];



   /* public function getDateAttribute(){
        $date = date('d/m/y', strtotime($this->created_at));
        return $date;
    }


    public function getDateTimeAttribute(){
        $date = date('d/m/y H:i:s', strtotime($this->created_at));
        return $date;
    }
*/


    public function expenseDetails()
    {
        return $this->hasMany(ExpenseDetail::class);
    }



}

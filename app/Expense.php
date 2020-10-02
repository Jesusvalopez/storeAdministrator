<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{

    use SoftDeletes;

    protected $appends = ['date'];



    public function getDateAttribute(){
        $date = date('d/m/Y', strtotime($this->expense_date));
        return $date;
    }
/*

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

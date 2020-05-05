<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class DiscountSaleDetail extends Model
{
    protected $table = 'discount_sale_detail';

    public function saleDetail()
    {
        return $this->belongsTo(SaleDetail::class);
    }
}

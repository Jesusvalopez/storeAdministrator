<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class PaymentMethodSale extends Model
{
    public function sale()
    {
        return $this->belongsTo(Sale::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentMethodSalesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_method_sales', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('sale_id');
            $table->foreign('sale_id')->references('id')->on('sales');
            $table->integer('payment_method_id');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods');
            $table->double('amount');
            $table->softDeletes('deleted_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payment_method_sales');
    }
}

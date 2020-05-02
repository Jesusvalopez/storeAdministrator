<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiscountSaleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('discount_sale', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('sale_id');
            $table->foreign('sale_id')->references('id')->on('sales');
            $table->integer('discount_id');
            $table->foreign('discount_id')->references('id')->on('discounts');
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
        Schema::dropIfExists('discount_sale');
    }
}

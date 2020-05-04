<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateDiscountSaleDetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('discount_sale_detail', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('sale_detail_id');
            $table->foreign('sale_detail_id')->references('id')->on('sale_details');
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
        Schema::dropIfExists('discount_sale_detail');
    }
}

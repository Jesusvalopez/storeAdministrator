<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCashboxDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cashbox_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('cashbox_id');
            $table->foreign('cashbox_id')->references('id')->on('cashboxes');
            $table->integer('quantity');
            $table->integer('cash_type');
            $table->timestamps();
            $table->softDeletes('deleted_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('cashbox_details');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCashboxMovementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('cashbox_movements', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('cashbox_id');
            $table->foreign('cashbox_id')->references('id')->on('cashboxes');
            $table->tinyInteger('movement_type');
            $table->double('amount');
            $table->string('description', 100);
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
        Schema::dropIfExists('cashbox_movements');
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddPriceProductToExpenseDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('expense_details', function (Blueprint $table) {
            $table->integer('price_id')->nullable();
            $table->foreign('price_id')->references('id')->on('prices');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('expense_details', function (Blueprint $table) {
            $table->dropForeign('expense_details_price_id_foreign');
            $table->dropColumn('price_id');

        });
    }
}
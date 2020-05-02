<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('product_histories', function (Blueprint $table) {
            $table->id();
            $table->integer('product_id');
            $table->foreign('product_id')->references('id')->on('products');
            $table->integer('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->integer('action_code');
            $table->string('last_value',50);
            $table->string('new_value',50);
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
        Schema::dropIfExists('product_histories');
    }
}

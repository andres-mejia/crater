<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Budget extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if (Schema::hasTable('budgets')) {
            $this->down();
        }

        
        Schema::create('budgets', function (Blueprint $table) {
            $table->increments('id');
            $table->date('budget_date');
            $table->date('expiry_date');
            $table->uuid('uuid');
            $table->year('period');
            $table->enum('status', ['draft', 'approved', 'closed']);
            $table->integer('typeId');
            $table->string('code')->nullable();
            $table->longText('notes')->nullable();
            $table->decimal('total', 15, 2)->nullable();
            
            // relations
            $table->integer('user_id')->unsigned()->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            //$table->integer('budget_template_id')->unsigned()->nullable();
            //$table->foreign('budget_template_id')->references('id')->on('budget_templates');
            
            $table->integer('company_id')->unsigned()->nullable();
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            
            $table->softDeletes();
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
        //
        Schema::dropIfExists('budgets');
    }
}

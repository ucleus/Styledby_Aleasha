<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained();
            $table->foreignId('service_type_id')->constrained();
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->enum('status', ['booked', 'paid', 'completed', 'canceled']);
            $table->string('square_payment_id')->nullable();
            $table->integer('amount_paid_cents')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['start_at', 'status']);
            $table->index('square_payment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};

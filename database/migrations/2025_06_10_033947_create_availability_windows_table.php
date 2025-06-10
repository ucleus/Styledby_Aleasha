
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availability_windows', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('stylist_id')->default(1); // For single stylist
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->integer('max_slots');
            $table->json('allowed_service_type_ids')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['start_at', 'end_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availability_windows');
    }
};

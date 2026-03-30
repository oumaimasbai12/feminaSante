<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('predicted_date');
            $table->enum('type', ['period', 'ovulation', 'fertile_window']);
            $table->enum('confidence', ['low', 'medium', 'high'])->default('medium');
            $table->smallInteger('cycle_length_avg')->nullable();
            $table->timestamps();

            $table->index('predicted_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predictions');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cycle_symptom', function (Blueprint $table) {
            $table->foreignId('cycle_id')->constrained('cycles')->cascadeOnDelete();
            $table->foreignId('symptom_id')->constrained('symptoms')->cascadeOnDelete();
            $table->tinyInteger('severity')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->primary(['cycle_id', 'symptom_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cycle_symptom');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pregnancy_symptoms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_id')->constrained('pregnancies')->cascadeOnDelete();
            $table->string('name', 100);
            $table->enum('intensity', ['faible', 'modéré', 'élevé', 'intense']);
            $table->text('notes')->nullable();
            $table->dateTime('recorded_at');
            $table->timestamp('created_at')->useCurrent();

            $table->index('pregnancy_id', 'pregnancy_symptoms_idx_pregnancy_id');
            $table->index('recorded_at', 'pregnancy_symptoms_idx_recorded_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pregnancy_symptoms');
    }
};

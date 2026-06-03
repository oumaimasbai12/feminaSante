<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Pivot: links each daily log to catalog symptoms with per-entry intensity (1–3).
        Schema::create('menopause_symptom_log_symptom', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menopause_symptom_log_id')
                ->constrained('menopause_symptom_logs')
                ->cascadeOnDelete();
            $table->foreignId('menopause_symptom_id')
                ->constrained('menopause_symptoms')
                ->cascadeOnDelete();
            $table->unsignedTinyInteger('intensity')->default(2); // 1=mild, 2=moderate, 3=severe
            $table->timestamps();

            $table->unique(['menopause_symptom_log_id', 'menopause_symptom_id'], 'log_symptom_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menopause_symptom_log_symptom');
    }
};

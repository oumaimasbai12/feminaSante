<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menopause_symptom_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menopause_id')->constrained('menopauses')->cascadeOnDelete();
            $table->date('log_date');
            $table->json('symptoms')->nullable();
            $table->enum('severity', ['mild', 'moderate', 'severe'])->default('moderate');
            $table->unsignedTinyInteger('sleep_quality')->nullable();
            $table->unsignedTinyInteger('mood_score')->nullable();
            $table->boolean('hot_flashes')->default(false);
            $table->boolean('night_sweats')->default(false);
            $table->boolean('mood_changes')->default(false);
            $table->boolean('sleep_changes')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['menopause_id', 'log_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menopause_symptom_logs');
    }
};

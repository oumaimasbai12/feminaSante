<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menopauses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('last_period_date')->nullable();
            $table->date('diagnosis_date')->nullable();
            $table->enum('stage', ['perimenopause', 'menopause', 'postmenopause'])->default('perimenopause');
            $table->enum('status', ['ongoing', 'completed'])->default('ongoing');
            $table->json('symptoms')->nullable();
            $table->boolean('cycle_irregularity')->default(false);
            $table->boolean('hot_flashes')->default(false);
            $table->boolean('night_sweats')->default(false);
            $table->boolean('mood_changes')->default(false);
            $table->boolean('sleep_changes')->default(false);
            $table->boolean('hormone_therapy')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index('stage');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menopauses');
    }
};

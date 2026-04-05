<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menopause_treatments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menopause_id')->constrained('menopauses')->cascadeOnDelete();
            $table->enum('treatment_type', ['medication', 'therapy', 'lifestyle', 'supplement', 'alternative', 'monitoring']);
            $table->string('name');
            $table->text('description')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['planned', 'active', 'completed', 'stopped'])->default('active');
            $table->boolean('relieves_hot_flashes')->default(false);
            $table->boolean('relieves_sleep_changes')->default(false);
            $table->boolean('relieves_mood_changes')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['menopause_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menopause_treatments');
    }
};

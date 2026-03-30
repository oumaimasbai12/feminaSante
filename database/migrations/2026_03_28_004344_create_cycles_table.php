<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cycles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('phase', ['menstruation', 'follicular', 'ovulation', 'luteal'])->default('menstruation');
            $table->enum('flow_intensity', ['light', 'medium', 'heavy'])->nullable();
            $table->enum('mood', ['happy', 'sad', 'irritable', 'anxious', 'calm', 'other'])->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('start_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cycles');
    }
};

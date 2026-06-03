<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pregnancy_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_id')->constrained('pregnancies')->cascadeOnDelete();
            $table->unsignedSmallInteger('week');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('checkup_type', [
                'first_trimester',
                'second_trimester',
                'third_trimester',
                'ultrasound',
                'blood_test',
                'urine_test',
                'glucose_test',
                'emergency',
                'routine',
            ])->default('routine');
            $table->date('scheduled_date');
            $table->enum('status', ['pending', 'completed', 'skipped'])->default('pending');
            $table->timestamp('reminder_sent_at')->nullable();
            $table->timestamps();

            $table->unique(['pregnancy_id', 'week', 'checkup_type']);
            $table->index(['pregnancy_id', 'scheduled_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pregnancy_milestones');
    }
};

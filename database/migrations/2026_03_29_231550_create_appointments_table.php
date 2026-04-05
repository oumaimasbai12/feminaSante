<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('gynecologist_id')->constrained('gynecologists')->cascadeOnDelete();
            $table->dateTime('start_time');
            $table->dateTime('end_time');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->string('consultation_type', 50)->nullable();
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_first_visit')->default(false);
            $table->string('cancellation_reason')->nullable();
            $table->tinyInteger('rating')->nullable();
            $table->text('review')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('user_id', 'appointements_idx_user_id');
            $table->index('gynecologist_id', 'appointements_idx_gynecologist_id');
            $table->index('start_time', 'appointements_idx_start_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointements');
    }
};

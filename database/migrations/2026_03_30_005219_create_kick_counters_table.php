<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kick_counters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_id')->constrained('pregnancies')->cascadeOnDelete();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->integer('kicks_count')->default(0);
            $table->enum('time_to_10_kicks', ['<30min', '30-60min', '1-2hours', '>2hours'])->nullable();
            $table->enum('activity_level', ['low', 'normal', 'high'])->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('pregnancy_id', 'kick_counters_idx_pregnancy_id');
            $table->index('date', 'kick_counters_idx_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kick_counters');
    }
};

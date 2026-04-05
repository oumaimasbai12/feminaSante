<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contractions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_id')->constrained('pregnancies')->cascadeOnDelete();
            $table->dateTime('start_time');
            $table->dateTime('end_time')->nullable();
            $table->integer('duration_seconds');
            $table->integer('interval_seconds');
            $table->enum('intensity', ['mild', 'moderate', 'strong', 'very strong'])->nullable();
            $table->boolean('is_active')->default(false);
            $table->text('notes')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('pregnancy_id', 'contractions_idx_pregnancy_id');
            $table->index('start_time', 'contractions_idx_start_time');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contractions');
    }
};

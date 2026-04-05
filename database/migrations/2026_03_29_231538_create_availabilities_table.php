<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gynecologist_id')->constrained('gynecologists')->cascadeOnDelete();
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_available')->default(true);
            $table->enum('recurrence', ['none', 'weekly', 'biweekly', 'monthly'])->default('none');
            $table->timestamp('created_at')->useCurrent();

            $table->index('gynecologist_id', 'availabilities_idx_gynecologist_id');
            $table->index('date', 'availabilities_idx_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availabilities');
    }
};

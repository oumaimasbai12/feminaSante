<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gynecologist_patient_priorities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gynecologist_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('priority', ['emergency', 'routine', 'follow_up'])->default('routine');
            $table->timestamps();

            $table->unique(['gynecologist_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gynecologist_patient_priorities');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pregnancies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->date('start_date');
            $table->date('due_date')->nullable();
            $table->date('conception_date')->nullable();
            $table->enum('pregnancy_type', ['simple', 'twins', 'triplets', 'multiples'])->default('simple');
            $table->enum('statuts', ['ongoing', 'completed', 'miscarriage', 'terminated'])->default('ongoing');
            $table->boolean('high_risk')->default(false);
            $table->text('risk_factors')->nullable();
            $table->string('blood_type', 5)->nullable();
            $table->boolean('rhesus_negative')->default(false);
            $table->json('allergies')->nullable();
            $table->json('medical_conditions')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('due_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pregnancies');
    }
};

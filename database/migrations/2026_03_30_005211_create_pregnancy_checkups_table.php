<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pregnancy_checkups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_id')->constrained('pregnancies')->cascadeOnDelete();
            $table->date('checkup_date');
            $table->smallInteger('week');
            $table->enum('checkup_type', [
                'first_trimester',
                'second_trimester',
                'third_trimester',
                'ultrasound',
                'blood_test',
                'urine_test',
                'glucose_test',
                'emergency',
                'routine'
            ]);
            $table->string('doctor_name')->nullable();
            $table->string('hospital_name')->nullable();
            $table->decimal('weight', 5, 2)->nullable();
            $table->smallInteger('blood_pressure_systolic');
            $table->smallInteger('blood_pressure_diastolic');
            $table->decimal('fundal_height', 4, 1)->nullable();
            $table->string('fetal_heart_rate', 20)->nullable();
            $table->json('observations')->nullable();
            $table->json('prescriptions')->nullable();
            $table->date('next_appointement')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pregnancy_checkups');
    }
};

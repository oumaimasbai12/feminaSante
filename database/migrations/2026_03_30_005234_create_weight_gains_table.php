<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weight_gains', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pregnancy_id')->constrained('pregnancies')->cascadeOnDelete();
            $table->date('date');
            $table->smallInteger('week');
            $table->decimal('weight', 5, 2);
            $table->decimal('bmi', 4, 1)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weight_gains');
    }
};

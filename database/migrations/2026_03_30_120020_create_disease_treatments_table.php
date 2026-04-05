<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disease_treatments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('disease_id')->constrained('diseases')->cascadeOnDelete();
            $table->enum('treatment_type', ['medication', 'surgery', 'therapy', 'lifestyle', 'alternative']);
            $table->text('description');
            $table->boolean('is_common')->default(true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disease_treatments');
    }
};

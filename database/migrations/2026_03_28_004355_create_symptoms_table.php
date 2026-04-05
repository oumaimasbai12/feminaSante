<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('symptoms', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->enum('category', ['physical', 'emotional', 'other'])->default('physical');
            $table->string('icon', 50)->nullable();
            $table->text('descriptions')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('symptoms');
    }
};

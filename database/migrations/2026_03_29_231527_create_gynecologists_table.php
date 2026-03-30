<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gynecologists', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('speciality')->default('Gynecologie');
            $table->string('license_number')->nullable()->unique();
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->text('address');
            $table->string('city', 100);
            $table->string('postal_code', 20)->nullable();
            $table->json('consultation_type')->nullable();
            $table->integer('consultation_duration')->default(30);
            $table->decimal('consultation_fee', 10, 2)->nullable();
            $table->text('bio')->nullable();
            $table->json('languages_spoken')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('review_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('city');
            $table->index('rating');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gynecologists');
    }
};

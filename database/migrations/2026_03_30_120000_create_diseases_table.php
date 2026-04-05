<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disease_categories', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->string('icon', 50)->nullable();
            $table->string('color', 20)->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('disease_categories')->nullOnDelete();
            $table->integer('display_order')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->index('slug', 'disease_categories_idx_slug');
        });

        Schema::create('diseases', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('scientific_nom')->nullable();
            $table->string('slug')->unique();
            $table->foreignId('category_id')->nullable()->constrained('disease_categories')->nullOnDelete();
            $table->text('description');
            $table->json('common_symptoms');
            $table->text('causes');
            $table->json('risk_factors')->nullable();
            $table->json('diagnosis_methods')->nullable();
            $table->text('treatment_overview')->nullable();
            $table->json('prevention_tips')->nullable();
            $table->text('complications')->nullable();
            $table->text('when_to_see_doctor');
            $table->json('specialistes')->nullable();
            $table->boolean('is_chronic')->default(false);
            $table->string('icd10_code', 20)->nullable();
            $table->json('resources')->nullable();
            $table->text('disclaimer')->default('⚠️ Ces informations sont éducatives et ne remplacent pas un avis médical professionnel.');
            $table->integer('view_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('slug', 'diseases_idx_slug');
            $table->index('category_id', 'diseases_idx_category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('diseases');
        Schema::dropIfExists('disease_categories');
    }
};

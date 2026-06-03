<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('menopauses', function (Blueprint $table) {
            // Structured profiling: age at symptom onset and duration of symptom history (months).
            $table->unsignedSmallInteger('age_at_onset')->nullable()->after('diagnosis_date');
            $table->unsignedSmallInteger('symptom_history_months')->nullable()->after('age_at_onset');
        });
    }

    public function down(): void
    {
        Schema::table('menopauses', function (Blueprint $table) {
            $table->dropColumn(['age_at_onset', 'symptom_history_months']);
        });
    }
};

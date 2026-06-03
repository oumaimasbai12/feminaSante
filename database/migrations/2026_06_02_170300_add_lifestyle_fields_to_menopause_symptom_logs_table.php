<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Lifestyle factors used by MenopauseService for correlation analysis.
        Schema::table('menopause_symptom_logs', function (Blueprint $table) {
            $table->unsignedTinyInteger('stress_level')->nullable()->after('sleep_changes');
            $table->unsignedTinyInteger('caffeine_cups')->nullable()->after('stress_level');
            $table->unsignedSmallInteger('exercise_minutes')->nullable()->after('caffeine_cups');
            $table->unsignedTinyInteger('alcohol_units')->nullable()->after('exercise_minutes');
        });
    }

    public function down(): void
    {
        Schema::table('menopause_symptom_logs', function (Blueprint $table) {
            $table->dropColumn(['stress_level', 'caffeine_cups', 'exercise_minutes', 'alcohol_units']);
        });
    }
};

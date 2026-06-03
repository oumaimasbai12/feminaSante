<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clinical_notes', function (Blueprint $table) {
            $table->text('patient_summary')->nullable()->after('notes');
            $table->boolean('shared_with_patient')->default(false)->after('patient_summary');
        });
    }

    public function down(): void
    {
        Schema::table('clinical_notes', function (Blueprint $table) {
            $table->dropColumn(['patient_summary', 'shared_with_patient']);
        });
    }
};

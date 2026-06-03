<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointements', function (Blueprint $table) {
            $table->text('patient_preparation')->nullable()->after('notes');
            $table->timestamp('reminder_24h_sent_at')->nullable()->after('cancellation_reason');
            $table->timestamp('reminder_2h_sent_at')->nullable()->after('reminder_24h_sent_at');
            $table->unsignedSmallInteger('follow_up_weeks')->nullable()->after('reminder_2h_sent_at');
        });

        Schema::create('consultation_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('gynecologist_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sender_id')->constrained('users')->cascadeOnDelete();
            $table->text('body');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();

            $table->index(['gynecologist_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consultation_messages');

        Schema::table('appointements', function (Blueprint $table) {
            $table->dropColumn([
                'patient_preparation',
                'reminder_24h_sent_at',
                'reminder_2h_sent_at',
                'follow_up_weeks',
            ]);
        });
    }
};

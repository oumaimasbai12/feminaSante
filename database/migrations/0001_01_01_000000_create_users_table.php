<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('motDePasse')->nullable();
            $table->rememberToken();
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['female', 'male', 'other'])->default('female');
            $table->string('blood_type', 5)->nullable();
            $table->json('emergency_contacts')->nullable();
            $table->json('medical_history')->nullable();
            $table->json('notification_settings')->nullable();
            $table->string('langage', 10)->default('fr');
            $table->timestamps();

            $table->index('email', 'users_idx_email');
            $table->index('birth_date', 'users_idx_birth_date');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

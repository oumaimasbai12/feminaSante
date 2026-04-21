<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'nom')) {
                $table->string('nom')->nullable();
            }

            if (! Schema::hasColumn('users', 'motDePasse')) {
                $table->string('motDePasse')->nullable();
            }

            if (! Schema::hasColumn('users', 'birth_date')) {
                $table->date('birth_date')->nullable();
            }

            if (! Schema::hasColumn('users', 'gender')) {
                $table->string('gender')->nullable();
            }

            if (! Schema::hasColumn('users', 'blood_type')) {
                $table->string('blood_type', 5)->nullable();
            }

            if (! Schema::hasColumn('users', 'emergency_contacts')) {
                $table->json('emergency_contacts')->nullable();
            }

            if (! Schema::hasColumn('users', 'medical_history')) {
                $table->json('medical_history')->nullable();
            }

            if (! Schema::hasColumn('users', 'notification_settings')) {
                $table->json('notification_settings')->nullable();
            }

            if (! Schema::hasColumn('users', 'langage')) {
                $table->string('langage', 10)->nullable();
            }
        });

        if (Schema::hasColumn('users', 'name') && Schema::hasColumn('users', 'nom')) {
            DB::table('users')
                ->whereNull('nom')
                ->update([
                    'nom' => DB::raw('name'),
                ]);
        }

        if (Schema::hasColumn('users', 'password') && Schema::hasColumn('users', 'motDePasse')) {
            DB::table('users')
                ->whereNull('motDePasse')
                ->update([
                    'motDePasse' => DB::raw('password'),
                ]);
        }

        if (Schema::hasColumn('users', 'gender')) {
            DB::table('users')
                ->whereNull('gender')
                ->update(['gender' => 'female']);
        }

        if (Schema::hasColumn('users', 'langage')) {
            DB::table('users')
                ->whereNull('langage')
                ->update(['langage' => 'fr']);
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('users')) {
            return;
        }

        Schema::table('users', function (Blueprint $table) {
            foreach ([
                'nom',
                'motDePasse',
                'birth_date',
                'gender',
                'blood_type',
                'emergency_contacts',
                'medical_history',
                'notification_settings',
                'langage',
            ] as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};

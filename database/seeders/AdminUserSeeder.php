<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@feminasante.ma'],
            [
                'name' => 'Admin Femina',
                'password' => Hash::make('Admin@1234'),
                'nom' => 'Admin Femina',
                'motDePasse' => Hash::make('Admin@1234'),
                'is_admin' => true,
                'gender' => 'female',
                'langage' => 'fr',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        DB::table('users')->updateOrInsert(
            ['email' => 'demo@feminasante.ma'],
            [
                'name' => 'Fatima Demo',
                'password' => Hash::make('Demo@1234'),
                'nom' => 'Fatima Demo',
                'motDePasse' => Hash::make('Demo@1234'),
                'is_admin' => false,
                'gender' => 'female',
                'langage' => 'fr',
                'birth_date' => '1992-05-14',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $this->command->info('✅ Users seeded (admin@feminasante.ma / Admin@1234)');
    }
}
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
                'nom' => 'Admin Femina',
                'motDePasse' => Hash::make('Admin123!'),
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
                'nom' => 'Fatima Demo',
                'motDePasse' => Hash::make('Demo123!'),
                'is_admin' => false,
                'gender' => 'female',
                'langage' => 'fr',
                'birth_date' => '1992-05-14',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $this->command->info('✅ Users seeded (admin@feminasante.ma / Admin123!, demo@feminasante.ma / Demo123!)');
    }
}
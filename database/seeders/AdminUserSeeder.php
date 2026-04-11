<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@feminasante.ma'],
            [
                'nom' => 'Admin Femina',
                'motDePasse' => Hash::make('Admin@1234'),
                'is_admin' => true,
                'gender' => 'female',
                'langage' => 'fr',
            ]
        );

        User::updateOrCreate(
            ['email' => 'demo@feminasante.ma'],
            [
                'nom' => 'Fatima Demo',
                'motDePasse' => Hash::make('Demo@1234'),
                'is_admin' => false,
                'gender' => 'female',
                'langage' => 'fr',
                'birth_date' => '1992-05-14',
            ]
        );

        $this->command->info('✅ Users seeded (admin@feminasante.ma / Admin@1234)');
    }
}
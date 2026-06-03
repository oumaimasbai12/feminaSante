<?php

namespace Database\Seeders;

use App\Models\Appointments\Gynecologist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class GynecologistUserSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Gynecologist::all() as $gyn) {
            $email = $gyn->email ?: strtolower(str_replace(
                ' ',
                '.',
                "dr.{$gyn->first_name}.{$gyn->last_name}@feminasante.ma"
            ));

            $nom = trim("{$gyn->first_name} {$gyn->last_name}");

            DB::table('users')->updateOrInsert(
                ['email' => $email],
                [
                    'nom' => $nom,
                    'motDePasse' => Hash::make('Gynecologue123!'),
                    'is_gynecologist' => true,
                    'birth_date' => '1980-05-15',
                    'gender' => 'female',
                    'langage' => 'fr',
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );

            $user = DB::table('users')->where('email', $email)->first();

            DB::table('gynecologists')
                ->where('id', $gyn->id)
                ->update([
                    'user_id' => $user->id,
                    'email' => $email,
                    'updated_at' => now(),
                ]);
        }

        $this->command->info('✅ Gynecologist login accounts seeded (password: Gynecologue123!)');
    }
}

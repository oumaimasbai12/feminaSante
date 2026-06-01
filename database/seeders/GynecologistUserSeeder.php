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
        $allGynecologists = Gynecologist::all();
        $counter = 1;

        foreach ($allGynecologists as $gyn) {
            // Create email from first and last name
            $firstName = $gyn->first_name ?? "Dr{$counter}";
            $lastName = $gyn->last_name ?? "Doctor{$counter}";
            $email = strtolower(str_replace(' ', '.', "dr.{$firstName}.{$lastName}@feminasante.ma"));

            $nom = trim("{$firstName} {$lastName}");

            // Create user
            $userId = DB::table('users')->updateOrInsert(
                ['email' => $email],
                [
                    'name' => $nom,
                    'nom' => $nom,
                    'password' => Hash::make('Gynecologue123!'),
                    'motDePasse' => Hash::make('Gynecologue123!'),
                    'is_gynecologist' => true,
                    'birth_date' => '1980-05-15',
                    'gender' => 'female',
                    'langage' => 'fr',
                    'updated_at' => now(),
                    'created_at' => now()
                ]
            );

            if (is_numeric($userId)) {
                $user = (object) ['id' => $userId];
            } else {
                $user = DB::table('users')->where('email', $email)->first();
            }

            // Link user to gynecologist if not already linked
            if (!$gyn->user_id) {
                $gyn->user_id = $user->id;
                $gyn->email = $email;
                $gyn->save();
            }

            $counter++;
        }
    }
}
<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class RegisterController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nom' => ['required_without:name', 'string', 'max:255'],
            'name' => ['required_without:nom', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'motDePasse' => ['required_without:password', 'string', 'min:8', 'confirmed'],
            'password' => ['required_without:motDePasse', 'string', 'min:8', 'confirmed'],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:female,male,other'],
            'blood_type' => ['nullable', 'string', 'max:5'],
            'emergency_contacts' => ['nullable', 'array'],
            'medical_history' => ['nullable', 'array'],
            'notification_settings' => ['nullable', 'array'],
            'langage' => ['nullable', 'string', 'max:10'],
        ]);

        $name = $data['nom'] ?? $data['name'];
        $hashedPassword = Hash::make($data['motDePasse'] ?? $data['password']);

        $payload = [
            'nom' => $name,
            'email' => $data['email'],
            'motDePasse' => $hashedPassword,
            'birth_date' => $data['birth_date'] ?? null,
            'gender' => $data['gender'] ?? 'female',
            'blood_type' => $data['blood_type'] ?? null,
            'emergency_contacts' => $data['emergency_contacts'] ?? null,
            'medical_history' => $data['medical_history'] ?? null,
            'notification_settings' => $data['notification_settings'] ?? null,
            'langage' => $data['langage'] ?? 'fr',
        ];

        if (Schema::hasColumn('users', 'name')) {
            $payload['name'] = $name;
        }

        if (Schema::hasColumn('users', 'password')) {
            $payload['password'] = $hashedPassword;
        }

        $user = User::create($payload);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully.',
            'user' => $user,
            'token' => $token,
        ], 201);
    }
}

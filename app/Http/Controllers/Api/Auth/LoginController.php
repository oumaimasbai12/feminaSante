<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'string', 'email'],
            'motDePasse' => ['required_without:password', 'string'],
            'password' => ['required_without:motDePasse', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        $password = $data['motDePasse'] ?? $data['password'];

        $storedPassword = $user?->motDePasse ?? $user?->password;

        if (! $user || ! $storedPassword || ! Hash::check($password, $storedPassword)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful.',
            'user' => $user,
            'token' => $token,
        ]);
    }
}

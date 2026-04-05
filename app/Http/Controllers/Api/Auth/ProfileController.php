<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'nom' => ['required_without:name', 'string', 'max:255'],
            'name' => ['required_without:nom', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'birth_date' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:female,male,other'],
            'blood_type' => ['nullable', 'string', 'max:5'],
            'emergency_contacts' => ['nullable', 'array'],
            'medical_history' => ['nullable', 'array'],
            'notification_settings' => ['nullable', 'array'],
            'langage' => ['nullable', 'string', 'max:10'],
        ]);

        $user->update([
            ...$data,
            'nom' => $data['nom'] ?? $data['name'],
        ]);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }

    public function logout(Request $request): JsonResponse
{
    /** @var \App\Models\User|null $user */
    $user = $request->user();

    if (! $user) {
        return response()->json([
            'message' => 'Unauthenticated.',
        ], 401);
    }

    $token = $user->currentAccessToken();

    if ($token instanceof \Laravel\Sanctum\PersonalAccessToken) {
        $token->delete();
    }

    return response()->json([
        'message' => 'Logged out successfully.',
    ]);
}
}

<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    // Step 1: Request reset — generates token and returns it (no email needed)
    public function request(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // Return success even if user not found (security best practice)
            return response()->json([
                'message' => 'Si cet email existe, un lien de réinitialisation a été généré.',
                'debug_token' => null,
            ]);
        }

        // Delete old tokens for this email
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Generate new token
        $token = Str::random(64);

        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Lien de réinitialisation généré avec succès.',
            'debug_token' => $token, // In production, this would be sent by email
            'reset_url' => '/reset-password?token=' . $token . '&email=' . urlencode($request->email),
        ]);
    }

    // Step 2: Reset password using token
    public function reset(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
            'token' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Token invalide ou expiré.'], 422);
        }

        // Check token expiry (60 minutes)
        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Le lien a expiré. Veuillez en demander un nouveau.'], 422);
        }

        if (!Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Token invalide.'], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable.'], 404);
        }

        $user->motDePasse = Hash::make($request->password);
        $user->save();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
        ]);
    }
}
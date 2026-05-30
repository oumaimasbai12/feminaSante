<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * GynecologistMiddleware
 *
 * Vérifie que l'utilisateur connecté :
 *   1. Est authentifié
 *   2. A le flag is_gynecologist = true
 *   3. Possède un profil gynécologue lié (gynecologistProfile)
 *
 * Enregistrement dans bootstrap/app.php :
 *
 *   ->withMiddleware(function (Middleware $middleware) {
 *       $middleware->alias([
 *           'gynecologist' => \App\Http\Middleware\GynecologistMiddleware::class,
 *       ]);
 *   })
 */
class GynecologistMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // 1. Authentification
        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Non authentifié.'], 401);
            }
            return redirect()->route('login');
        }

        // 2. Flag is_gynecologist
        if (!$user->is_gynecologist) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Accès réservé aux praticiens.',
                ], 403);
            }
            abort(403, 'Accès réservé aux praticiens.');
        }

        // 3. Profil gynécologue existant
        if (!$user->gynecologistProfile) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Profil praticien introuvable. Contactez un administrateur.',
                ], 403);
            }
            abort(403, 'Profil praticien introuvable.');
        }

        return $next($request);
    }
}
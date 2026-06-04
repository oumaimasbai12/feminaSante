<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\WikipediaImportService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WikipediaImportController extends Controller
{
    public function __invoke(Request $request, WikipediaImportService $wikipedia): JsonResponse
    {
        $data = $request->validate([
            'topic' => ['required', 'string', 'max:255'],
        ]);

        try {
            $result = $wikipedia->import($data['topic']);
        } catch (ConnectionException) {
            return response()->json([
                'message' => 'Impossible de contacter Wikipédia. Vérifiez votre connexion et réessayez.',
            ], 503);
        }

        if ($result === null) {
            return response()->json([
                'message' => 'Sujet introuvable sur Wikipédia.',
            ], 404);
        }

        return response()->json([
            'message' => 'Article importé depuis Wikipédia.',
            'data' => $result,
        ]);
    }
}

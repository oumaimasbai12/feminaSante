<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIService
{
    private string $apiKey;
    private string $apiUrl;
    private string $systemPrompt;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key', '');
        $this->apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

        $this->systemPrompt = <<<PROMPT
Tu es Femina, une assistante de santé féminine bienveillante et professionnelle sur la plateforme Femina Santé.

Ton rôle :
- Répondre aux questions sur la santé féminine (cycle menstruel, grossesse, ménopause, gynécologie générale)
- Donner des informations éducatives claires, empathiques et fondées sur des données médicales fiables
- Encourager les utilisatrices à consulter un professionnel de santé pour tout diagnostic ou traitement
- Répondre en français, avec un ton chaleureux mais professionnel

Règles importantes :
- Tu ne poses jamais de diagnostic
- Tu ne prescris jamais de médicaments
- En cas de symptômes urgents (douleurs intenses, saignements abondants, fièvre élevée), oriente immédiatement vers les urgences
- Reste toujours dans le domaine de la santé féminine
- Réponds de façon concise (3-5 phrases maximum sauf si plus de détails sont vraiment nécessaires)
PROMPT;
    }

    public function generateHealthResponse(string $message, array $context = []): array
    {
        $intent = $this->detectIntent($message);
        $sentiment = $this->detectSentiment($message);

        if (empty($this->apiKey)) {
            return $this->fallbackResponse($intent, $sentiment, $context);
        }

        try {
            $contents = [];

            if (!empty($context['history']) && is_array($context['history'])) {
                foreach ($context['history'] as $turn) {
                    if (!empty($turn['user'])) {
                        $contents[] = ['role' => 'user', 'parts' => [['text' => $turn['user']]]];
                    }
                    if (!empty($turn['assistant'])) {
                        $contents[] = ['role' => 'model', 'parts' => [['text' => $turn['assistant']]]];
                    }
                }
            }

            $contents[] = ['role' => 'user', 'parts' => [['text' => $message]]];

            $response = Http::timeout(20)->post("{$this->apiUrl}?key={$this->apiKey}", [
                'system_instruction' => [
                    'parts' => [['text' => $this->systemPrompt]],
                ],
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 512,
                ],
            ]);

            if ($response->successful()) {
                $text = $response->json('candidates.0.content.parts.0.text');
                if ($text) {
                    return [
                        'response' => trim($text),
                        'intent' => $intent,
                        'sentiment' => $sentiment,
                        'context' => $context,
                    ];
                }
            }

            Log::warning('Gemini API unexpected response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

        } catch (\Throwable $e) {
            Log::error('Gemini API error: ' . $e->getMessage());
        }

        return $this->fallbackResponse($intent, $sentiment, $context);
    }

    private function detectIntent(string $message): string
    {
        $n = mb_strtolower($message);
        if (str_contains($n, 'urgent') || str_contains($n, 'urgence') || str_contains($n, 'au secours'))
            return 'urgent';
        if (str_contains($n, 'douleur') || str_contains($n, 'saignement') || str_contains($n, 'symptôme'))
            return 'symptom_question';
        if (str_contains($n, 'grossesse') || str_contains($n, 'enceinte') || str_contains($n, 'bébé'))
            return 'pregnancy';
        if (str_contains($n, 'cycle') || str_contains($n, 'règles') || str_contains($n, 'menstruation'))
            return 'cycle';
        if (str_contains($n, 'ménopause') || str_contains($n, 'bouffée'))
            return 'menopause';
        return 'general';
    }

    private function detectSentiment(string $message): string
    {
        $n = mb_strtolower($message);
        if (str_contains($n, 'peur') || str_contains($n, 'inquièt') || str_contains($n, 'urgent'))
            return 'concerned';
        if (str_contains($n, 'merci') || str_contains($n, 'super') || str_contains($n, 'bien'))
            return 'positive';
        return 'neutral';
    }

    private function fallbackResponse(string $intent, string $sentiment, array $context): array
    {
        $response = $intent === 'urgent'
            ? '⚠️ Si la situation semble urgente, consultez immédiatement un professionnel de santé ou rendez-vous aux urgences.'
            : 'Je suis désolée, je ne peux pas répondre pour le moment. Pour toute question médicale, veuillez consulter un professionnel de santé.';

        return [
            'response' => $response,
            'intent' => $intent,
            'sentiment' => $sentiment,
            'context' => $context,
        ];
    }
}
<?php

namespace App\Services;

class AIService
{
    public function generateHealthResponse(string $message, array $context = []): array
    {
        $normalized = mb_strtolower($message);

        $intent = 'general';
        $sentiment = 'neutral';

        if (str_contains($normalized, 'douleur') || str_contains($normalized, 'saignement')) {
            $intent = 'symptom_question';
        }

        if (str_contains($normalized, 'urgent') || str_contains($normalized, 'urgence')) {
            $intent = 'urgent';
            $sentiment = 'concerned';
        }

        if ($intent === 'urgent') {
            return [
                'response' => "Si la situation semble urgente, consulte rapidement un professionnel de sante ou rends-toi aux urgences. Cet assistant ne remplace pas un avis medical.",
                'intent' => $intent,
                'sentiment' => $sentiment,
                'context' => $context,
            ];
        }

        return [
            'response' => "Merci pour ton message. Cette premiere version de l'assistant donne un accompagnement educatif uniquement. Pour une question medicale precise, consulte un professionnel de sante.",
            'intent' => $intent,
            'sentiment' => $sentiment,
            'context' => $context,
        ];
    }
}

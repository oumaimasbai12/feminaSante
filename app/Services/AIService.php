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
                'response' => 'Si la situation semble urgente, consulte rapidement un professionnel de santé ou rends-toi aux urgences. Cet assistant ne remplace pas un avis médical.',
                'intent' => $intent,
                'sentiment' => $sentiment,
                'context' => $context,
            ];
        }

        if ($intent === 'symptom_question') {
            return [
                'response' => 'Les symptômes comme la douleur ou les saignements méritent souvent un avis professionnel. Utilise aussi notre encyclopédie médicale pour t\'informer, sans te substituer à une consultation.',
                'intent' => $intent,
                'sentiment' => $sentiment,
                'context' => $context,
            ];
        }

        return [
            'response' => 'Merci pour ton message. Cette première version de l\'assistant donne un accompagnement éducatif uniquement. Pour une question médicale précise, consulte un professionnel de santé.',
            'intent' => $intent,
            'sentiment' => $sentiment,
            'context' => $context,
        ];
    }
}

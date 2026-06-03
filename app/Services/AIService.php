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
        $model = config('services.gemini.model', 'gemini-3.1-flash-lite-preview');
        $this->apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent";

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
        if (str_contains($n, 'ovulation') || str_contains($n, 'ovule'))
            return 'ovulation';
        if (str_contains($n, 'spm') || str_contains($n, 'syndrome prémenstruel'))
            return 'spm';
        if (str_contains($n, 'aliment') || str_contains($n, 'nourriture') || str_contains($n, 'manger'))
            return 'food';
        if (str_contains($n, 'douleur') || str_contains($n, 'saignement') || str_contains($n, 'symptôme'))
            return 'symptom_question';
        if (str_contains($n, 'grossesse') || str_contains($n, 'enceinte') || str_contains($n, 'bébé') || str_contains($n, 'enfant'))
            return 'pregnancy';
        if (str_contains($n, 'cycle') || str_contains($n, 'règles') || str_contains($n, 'menstruation') || str_contains($n, 'période') || str_contains($n, 'menstruel'))
            return 'cycle';
        if (str_contains($n, 'ménopause') || str_contains($n, 'bouffée') || str_contains($n, 'chaleur'))
            return 'menopause';
        if (str_contains($n, 'gynécologue') || str_contains($n, 'médecin') || str_contains($n, 'consulter'))
            return 'doctor';
        if (str_contains($n, 'bonjour') || str_contains($n, 'salut') || str_contains($n, 'coucou') || str_contains($n, 'hello'))
            return 'greeting';
        return 'general';
    }

    private function detectSentiment(string $message): string
    {
        $n = mb_strtolower($message);
        if (str_contains($n, 'peur') || str_contains($n, 'inquièt') || str_contains($n, 'urgent'))
            return 'concerned';
        if (str_contains($n, 'merci') || str_contains($n, 'super') || str_contains($n, 'bien') || str_contains($n, 'parfait'))
            return 'positive';
        return 'neutral';
    }

    private function fallbackResponse(string $intent, string $sentiment, array $context): array
    {
        $responses = [
            'urgent' => '⚠️ Si la situation semble urgente, consultez immédiatement un professionnel de santé ou rendez-vous aux urgences. Votre santé est la priorité.',
            'cycle' => "Voici quelques informations sur le cycle menstruel :\n- Le cycle moyen dure 28 jours (mais peut varier entre 21 et 35 jours)\n- Les règles durent généralement 3 à 7 jours\n- Il est normal d'avoir des douleurs légères, mais si elles sont intenses, consultez un gynécologue",
            'pregnancy' => "Voici quelques informations sur la grossesse :\n- Consultez un professionnel de santé pour un suivi régulier\n- Prenez de l'acide folique si vous envisagez une grossesse\n- Évitez l'alcool, le tabac et les médicaments sans avis médical",
            'menopause' => "Voici quelques informations sur la ménopause :\n- Les bouffées de chaleur sont courantes\n- Un régime équilibré et de l'exercice peuvent aider\n- N'hésitez pas à consulter un gynécologue pour discuter des options de traitement",
            'symptom_question' => "Je comprends votre préoccupation. Pour tout symptôme, il est important de consulter un professionnel de santé pour un diagnostic précis. N'oubliez pas de noter la durée et l'intensité des symptômes pour votre rendez-vous.",
            'doctor' => "Vous pouvez consulter la section « Gynécologues » de notre plateforme pour trouver un professionnel de santé près de chez vous ! Il est important de consulter régulièrement un gynécologue pour votre santé.",
            'greeting' => "Bonjour ! Je suis Femina, votre assistante de santé féminine. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur le cycle menstruel, la grossesse, la ménopause, ou consulter notre section Articles pour plus d'informations !",
            'ovulation' => "Voici comment suivre l'ovulation à la maison :\n- **Suivi de la température basale** : Prendre votre température chaque matin avant de se lever – elle augmente légèrement après l'ovulation.\n- **Observations du mucus cervical** : Le mucus devient clair, glissant et extensible (comme le blanc d'œuf) pendant la période fertile.\n- **Tests d'ovulation urinaires** : Ils détectent l'hormone LH qui augmente 24 à 36 heures avant l'ovulation.\n- **Applications de suivi du cycle** : Elles peuvent vous aider à prédire votre période fertile en fonction de vos cycles passés.",
            'spm' => "Voici les symptômes normaux du SPM (syndrome prémenstruel) :\n- Ballonnements, seins sensibles\n- Fatigue, maux de tête\n- Irritabilité, sautes d'humeur, légère tristesse\n- Ces symptômes apparaissent généralement dans la semaine avant les règles et disparaissent une fois celles-ci commencées.\n- Si vos symptômes sont très intenses et perturbent votre quotidien, n'hésitez pas à consulter un professionnel de santé.",
            'food' => "Voici quelques aliments qui peuvent aider pendant les règles :\n- Aliments riches en fer (épinards, lentilles, viande rouge maigre) pour compenser les pertes sanguines\n- Aliments riches en magnésium (noix, graines, bananes) pour réduire les crampes et améliorer l'humeur\n- Aliments riches en oméga-3 (poisson gras, graines de lin) pour réduire l'inflammation\n- Boissons chaudes (thé à la camomille, thé à la menthe) pour apaiser les douleurs\n- Évitez les aliments trop salés (qui causent des ballonnements) et trop sucrés.",
            'general' => "Je suis là pour vous aider avec vos questions sur la santé féminine ! Voici quelques sujets que je peux aborder :\n- Le cycle menstruel et les règles\n- La grossesse et la maternité\n- La ménopause\n- La consultation d'un gynécologue\n\nN'hésitez pas à être précis dans votre question, et je vous aiderai du mieux que je peux !"
        ];

        $response = $responses[$intent] ?? $responses['general'];

        return [
            'response' => $response,
            'intent' => $intent,
            'sentiment' => $sentiment,
            'context' => $context,
        ];
    }
}
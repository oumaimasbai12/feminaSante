<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class WikipediaImportService
{
    private const BASE_URL = 'https://fr.wikipedia.org';

    private const USER_AGENT = 'FeminaSante/1.0 (health education app; contact@feminasante.local)';

    private const SKIP_SECTION_PATTERN = '/^(Notes?|Références?|Voir aussi|Liens externes|Bibliographie|Annexes?|Portails?|Galerie|Sources)/iu';

    /**
     * @return array{title: string, excerpt: string, content: string, wiki_topic: string}|null
     */
    public function import(string $query): ?array
    {
        $topic = $this->resolveTopic($query);
        if ($topic === null) {
            return null;
        }

        $summaryRes = $this->http()->get(self::BASE_URL . '/api/rest_v1/page/summary/' . rawurlencode($topic));
        if (!$summaryRes->successful()) {
            return null;
        }

        $summary = $summaryRes->json();
        $title = $summary['title'] ?? str_replace('_', ' ', $topic);
        $extract = $summary['extract'] ?? '';

        $body = $this->fetchBodyFromParseApi($topic, $extract);
        $content = $this->buildContent($topic, $body);

        $excerpt = Str::limit($extract, 300);
        if (strlen($extract) > 300) {
            $excerpt .= '...';
        }

        return [
            'title' => $title,
            'excerpt' => $excerpt,
            'content' => $content,
            'wiki_topic' => $topic,
        ];
    }

    private function resolveTopic(string $query): ?string
    {
        $query = trim($query);
        if ($query === '') {
            return null;
        }

        $candidates = array_unique([
            str_replace(' ', '_', $query),
            $query,
        ]);

        foreach ($candidates as $candidate) {
            $topic = $this->topicFromSummary($candidate);
            if ($topic !== null && !$this->isDisambiguation($topic)) {
                return $topic;
            }
        }

        $searchRes = $this->http()->get(self::BASE_URL . '/w/api.php', [
            'action' => 'opensearch',
            'search' => $query,
            'limit' => 5,
            'namespace' => 0,
            'format' => 'json',
        ]);

        if (!$searchRes->successful()) {
            return null;
        }

        foreach ($searchRes->json()[1] ?? [] as $title) {
            $topic = str_replace(' ', '_', $title);
            if (!$this->isDisambiguation($topic) && $this->topicFromSummary($topic) !== null) {
                return $topic;
            }
        }

        return null;
    }

    private function topicFromSummary(string $candidate): ?string
    {
        $res = $this->http()->get(self::BASE_URL . '/api/rest_v1/page/summary/' . rawurlencode($candidate));
        if (!$res->successful() || empty($res->json()['title'])) {
            return null;
        }

        $canonical = $res->json()['titles']['canonical'] ?? $candidate;

        return str_replace(' ', '_', $canonical);
    }

    private function isDisambiguation(string $topic): bool
    {
        $res = $this->http()->get(self::BASE_URL . '/w/api.php', [
            'action' => 'query',
            'titles' => str_replace('_', ' ', $topic),
            'prop' => 'pageprops',
            'ppprop' => 'disambiguation',
            'format' => 'json',
        ]);

        if (!$res->successful()) {
            return false;
        }

        $pages = $res->json()['query']['pages'] ?? [];
        $page = reset($pages) ?: [];

        return isset($page['pageprops']['disambiguation']);
    }

    private function fetchBodyFromParseApi(string $topic, string $introExtract): string
    {
        $page = str_replace('_', ' ', $topic);
        $body = '';

        if ($introExtract !== '') {
            $body .= '<p class="mb-4 text-brand-muted leading-relaxed">' . e($introExtract) . '</p>';
        }

        $sectionsRes = $this->http()->get(self::BASE_URL . '/w/api.php', [
            'action' => 'parse',
            'page' => $page,
            'prop' => 'sections',
            'format' => 'json',
        ]);

        if (!$sectionsRes->successful()) {
            return $body;
        }

        $sections = $sectionsRes->json()['parse']['sections'] ?? [];
        $added = 0;
        $maxSections = 6;

        foreach ($sections as $section) {
            if ($added >= $maxSections) {
                break;
            }

            $line = trim($section['line'] ?? '');
            $index = $section['index'] ?? null;

            if ($line === '' || $index === null || preg_match(self::SKIP_SECTION_PATTERN, $line)) {
                continue;
            }

            $html = $this->parseSectionHtml($page, (int) $index);
            if ($html === null || trim(strip_tags($html)) === '') {
                continue;
            }

            $body .= '<h3 class="text-lg font-bold text-brand-ink mt-6 mb-3">' . e($line) . '</h3>';
            $body .= $this->cleanHtml($html);
            $added++;
        }

        return $body;
    }

    private function parseSectionHtml(string $page, int $sectionIndex): ?string
    {
        $res = $this->http()->get(self::BASE_URL . '/w/api.php', [
            'action' => 'parse',
            'page' => $page,
            'section' => $sectionIndex,
            'prop' => 'text',
            'format' => 'json',
            'formatversion' => '2',
            'disableeditsection' => true,
            'disabletoc' => true,
        ]);

        if (!$res->successful()) {
            return null;
        }

        return $res->json()['parse']['text'] ?? null;
    }

    private function buildContent(string $topic, string $body): string
    {
        if (trim(strip_tags($body)) === '') {
            return '';
        }

        $wikiUrl = self::BASE_URL . '/wiki/' . rawurlencode(str_replace('_', ' ', $topic));
        $body .= '<div class="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-6"><p><strong>Information médicale</strong> : Cet article est fourni à titre éducatif uniquement. Il ne remplace pas l\'avis d\'un professionnel de santé. Source : <a href="' . e($wikiUrl) . '" target="_blank" class="text-brand-primary font-semibold underline">Wikipédia</a>.</p></div>';

        return $body;
    }

    private function cleanHtml(string $html): string
    {
        $html = preg_replace('/<div[^>]*class="[^"]*hatnote[^"]*"[^>]*>.*?<\/div>/is', '', $html);
        $html = preg_replace('/<table[^>]*>.*?<\/table>/is', '', $html);
        $html = preg_replace('/<[^>]*class="[^"]*reference[^"]*"[^>]*>.*?<\/[^>]*>/is', '', $html);
        $html = preg_replace('/<sup[^>]*>.*?<\/sup>/is', '', $html);
        $html = preg_replace('/<\/?span[^>]*>/i', '', $html);
        $html = preg_replace('/<figure[^>]*>.*?<\/figure>/is', '', $html);
        $html = preg_replace('/<style[^>]*>.*?<\/style>/is', '', $html);
        $html = preg_replace('/\[modifier[^\]]*\]/u', '', $html);
        $html = preg_replace('/\[\d+\]/', '', $html);
        $html = strip_tags($html, '<p><ul><li><b><strong><em><h3><h4><ol><br>');
        $html = trim(Str::limit($html, 8000));

        if ($html !== '' && !str_starts_with($html, '<')) {
            $html = '<p class="mb-4 text-slate-700 leading-relaxed">' . $html . '</p>';
        }

        return $html;
    }

    private function http()
    {
        return Http::timeout(20)->withHeaders(['User-Agent' => self::USER_AGENT]);
    }
}

<?php

namespace Database\Seeders;

use App\Models\Articles\Article;
use App\Models\Articles\ArticleCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class WikipediaArticleSeeder extends Seeder
{
    // Wikipedia French topics mapped to your DB categories
    private array $topics = [
        'cycle-menstruel' => [
            'Menstruation',
            'Cycle_menstruel',
            'Syndrome_prémenstruel',
            'Dysménorrhée',
            'Ovulation',
        ],
        'grossesse' => [
            'Grossesse',
            'Suivi_de_grossesse',
            'Nausée_du_matin',
            'Accouchement',
        ],
        'menopause' => [
            'Ménopause',
            'Périménopause',
            'Bouffée_de_chaleur',
        ],
        'sante-sexuelle' => [
            'Contraception',
            'Contraception_hormonale',
            'Infections_sexuellement_transmissibles',
        ],
        'nutrition' => [
            'Alimentation_et_grossesse',
            'Acide_folique',
            'Fer_(nutriment)',
        ],
        'bien-etre-mental' => [
            'Dépression_post-partum',
            'Anxiété',
            'Stress_(biologie)',
        ],
    ];

    public function run(): void
    {
        $admin = User::where('is_admin', true)->first();

        if (!$admin) {
            $this->command->error('❌ No admin user found. Run AdminUserSeeder first.');
            return;
        }

        $this->command->info('📖 Fetching articles from Wikipedia (French)...');

        $total = array_sum(array_map('count', $this->topics));
        $bar = $this->command->getOutput()->createProgressBar($total);
        $bar->start();

        foreach ($this->topics as $categorySlug => $wikipediaTopics) {
            $category = ArticleCategory::where('slug', $categorySlug)->first();

            foreach ($wikipediaTopics as $topic) {
                $bar->advance();

                // Skip if already exists
                $slug = Str::slug(str_replace('_', ' ', $topic));
                if (Article::where('slug', 'like', $slug . '%')->exists()) {
                    continue;
                }

                $data = $this->fetchFromWikipedia($topic);
                if (!$data) {
                    sleep(1);
                    continue;
                }

                // Clean up Wikipedia content
                $content = $this->buildHtmlContent($data);
                $readTime = max(3, (int) (str_word_count(strip_tags($content)) / 200));

                Article::create([
                    'title' => $data['title'],
                    'slug' => Str::slug($data['title']) . '-' . rand(100, 999),
                    'excerpt' => $data['excerpt'],
                    'content' => $content,
                    'category_id' => $category?->id,
                    'author_id' => $admin->id,
                    'tags' => $this->generateTags($data['title'], $categorySlug),
                    'status' => 'published',
                    'published_at' => now()->subDays(rand(1, 90)),
                    'read_time' => $readTime,
                    'is_featured' => rand(0, 4) === 0,
                    'is_premium' => false,
                    'views_count' => rand(10, 500),
                    'likes_count' => rand(0, 50),
                    'shares_count' => rand(0, 20),
                ]);

                sleep(1); // Be polite to Wikipedia API
            }
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info('✅ Wikipedia articles seeded successfully!');
        $this->command->info('📊 Total articles: ' . Article::count());
    }

    private function fetchFromWikipedia(string $topic): ?array
    {
        try {
            // Get page summary
            $summaryRes = Http::timeout(10)
                ->withHeaders(['User-Agent' => 'FeminaSante/1.0 (health education app)'])
                ->get("https://fr.wikipedia.org/api/rest_v1/page/summary/{$topic}");

            if (!$summaryRes->successful())
                return null;

            $summary = $summaryRes->json();
            $title = $summary['title'] ?? str_replace('_', ' ', $topic);
            $excerpt = $summary['extract'] ?? '';

            // Get full page sections
            $sectionsRes = Http::timeout(10)
                ->withHeaders(['User-Agent' => 'FeminaSante/1.0 (health education app)'])
                ->get("https://fr.wikipedia.org/api/rest_v1/page/mobile-sections/{$topic}");

            $sections = [];
            if ($sectionsRes->successful()) {
                $data = $sectionsRes->json();
                $allSections = $data['remaining']['sections'] ?? [];
                // Take first 8 sections instead of 4
                foreach (array_slice($allSections, 0, 8) as $section) {
                    if (!empty($section['line']) && !empty($section['text'])) {
                        $sections[] = [
                            'title' => strip_tags($section['line']),
                            'text' => $this->cleanWikipediaHtml($section['text']),
                        ];
                    }
                }
            }

            return [
                'title' => $title,
                'excerpt' => Str::limit($excerpt, 300),
                'sections' => $sections,
                'source' => "https://fr.wikipedia.org/wiki/{$topic}",
            ];

        } catch (\Throwable $e) {
            return null;
        }
    }

    private function buildHtmlContent(array $data): string
    {
        $html = '';

        // Intro
        if ($data['excerpt']) {
            $html .= "<p class=\"mb-4\">{$data['excerpt']}</p>\n\n";
        }

        // Sections
        foreach ($data['sections'] as $section) {
            $html .= "<h2 class=\"text-2xl font-bold text-slate-900 mt-6 mb-3\">{$section['title']}</h2>\n";
            $html .= "<p class=\"mb-4 text-slate-700 leading-relaxed\">{$section['text']}</p>\n\n";
        }

        // Medical disclaimer
        $html .= "<div class=\"bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-6\">";
        $html .= "<p class=\"text-amber-800\"><strong>⚠️ Information médicale</strong> : Cet article est fourni à titre éducatif uniquement. ";
        $html .= "Il ne remplace pas l'avis d'un professionnel de santé. ";
        $html .= "Source : <a href=\"{$data['source']}\" target=\"_blank\" class=\"text-amber-700 underline\">Wikipédia</a>.</p>";
        $html .= "</div>";

        return $html;
    }

    private function cleanWikipediaHtml(string $html): string
    {
        // Remove Wikipedia-specific elements
        $html = preg_replace('/<[^>]*class="[^"]*reference[^"]*"[^>]*>.*?<\/[^>]*>/is', '', $html);
        $html = preg_replace('/<sup[^>]*>.*?<\/sup>/is', '', $html);
        $html = preg_replace('/<\/?span[^>]*>/i', '', $html);
        $html = preg_replace('/<figure[^>]*>.*?<\/figure>/is', '', $html);
        $html = preg_replace('/\[\d+\]/', '', $html);
        $html = strip_tags($html, '<p><ul><li><b><strong><em><h3><ol>');
        // Increase limit from 1500 to 5000
        $html = trim(Str::limit($html, 5000));
        
        // Ensure there are paragraphs
        $html = str_replace("\n\n", "</p><p>", $html);
        if (substr($html, 0, 2) !== "<p") {
            $html = "<p>" . $html . "</p>";
        }
        
        return $html;
    }

    private function generateTags(string $title, string $category): array
    {
        $tagMap = [
            'cycle-menstruel' => ['cycle', 'menstruation', 'règles', 'santé féminine'],
            'grossesse' => ['grossesse', 'maternité', 'bébé', 'santé féminine'],
            'menopause' => ['ménopause', 'hormones', 'femme', 'santé féminine'],
            'sante-sexuelle' => ['contraception', 'santé sexuelle', 'gynécologie'],
            'nutrition' => ['nutrition', 'alimentation', 'santé', 'vitamines'],
            'bien-etre-mental' => ['santé mentale', 'bien-être', 'stress', 'anxiété'],
        ];

        $tags = $tagMap[$category] ?? ['santé féminine'];
        $tags[] = Str::lower($title);
        return array_slice($tags, 0, 4);
    }
}

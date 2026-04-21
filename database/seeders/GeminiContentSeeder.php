<?php

namespace Database\Seeders;

use App\Models\Articles\Article;
use App\Models\Articles\ArticleCategory;
use App\Models\Diseases\Disease;
use App\Models\Diseases\DiseaseCategory;
use App\Models\Diseases\DiseaseSymptom;
use App\Models\Diseases\DiseaseTreatment;
use App\Models\Diseases\DiseaseFaq;
use App\Models\Quiz\Quiz;
use App\Models\Quiz\Question;
use App\Models\Quiz\QuestionOption;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class GeminiContentSeeder extends Seeder
{
    private string $apiKey;
    private string $apiUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key', '');
        $this->apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    }

    public function run(): void
    {
        if (empty($this->apiKey)) {
            $this->command->error('❌ GEMINI_API_KEY not set in .env');
            return;
        }

        $this->command->info('🤖 Generating content with Gemini AI...');
        $this->seedArticles();
        $this->seedDiseases();
        $this->seedQuizzes();
    }

    private function seedArticles(): void
    {
        $admin = User::where('is_admin', true)->first();
        if (!$admin) {
            $this->command->warn('⚠️ No admin user found — run AdminUserSeeder first.');
            return;
        }

        $topics = [
            ['category_slug' => 'cycle-menstruel', 'title' => 'Comprendre les phases de votre cycle menstruel'],
            ['category_slug' => 'cycle-menstruel', 'title' => 'Comment soulager les douleurs menstruelles naturellement'],
            ['category_slug' => 'cycle-menstruel', 'title' => 'Le syndrome prémenstruel (SPM) : symptômes et solutions'],
            ['category_slug' => 'grossesse', 'title' => 'Les premiers signes de grossesse à connaître'],
            ['category_slug' => 'grossesse', 'title' => 'Nutrition pendant la grossesse : ce qu\'il faut manger'],
            ['category_slug' => 'grossesse', 'title' => 'Le suivi prénatal trimestre par trimestre'],
            ['category_slug' => 'menopause', 'title' => 'Comprendre la périménopause et ses symptômes'],
            ['category_slug' => 'menopause', 'title' => 'Les bouffées de chaleur : causes et remèdes naturels'],
            ['category_slug' => 'sante-sexuelle', 'title' => 'Tout savoir sur la contraception hormonale'],
            ['category_slug' => 'nutrition', 'title' => 'Les aliments essentiels pour équilibrer vos hormones'],
            ['category_slug' => 'bien-etre-mental', 'title' => 'Anxiété et cycle menstruel : comprendre le lien'],
        ];

        $bar = $this->command->getOutput()->createProgressBar(count($topics));
        $bar->start();

        foreach ($topics as $topic) {
            $category = ArticleCategory::where('slug', $topic['category_slug'])->first();
            if (!$category) {
                $bar->advance();
                continue;
            }

            if (Article::where('slug', Str::slug($topic['title']))->exists()) {
                $bar->advance();
                continue;
            }

            $json = $this->callGemini($this->articlePrompt($topic['title']));
            if (!$json) {
                $bar->advance();
                sleep(2);
                continue;
            }

            Article::create([
                'title' => $topic['title'],
                'slug' => Str::slug($topic['title']),
                'excerpt' => $json['excerpt'] ?? '',
                'content' => $json['content'] ?? '',
                'category_id' => $category->id,
                'author_id' => $admin->id,
                'tags' => $json['tags'] ?? [],
                'status' => 'published',
                'published_at' => now()->subDays(rand(1, 60)),
                'read_time' => $json['read_time'] ?? 5,
                'is_featured' => rand(0, 1),
                'is_premium' => false,
            ]);

            $bar->advance();
            sleep(1);
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info('✅ Articles seeded');
    }

    private function articlePrompt(string $title): string
    {
        return <<<PROMPT
Tu es une rédactrice médicale spécialisée en santé féminine. Écris un article en français sur : "{$title}".

Retourne UNIQUEMENT un objet JSON valide (sans markdown, sans backticks) :
{
  "excerpt": "Résumé accrocheur de 2 phrases maximum",
  "content": "Contenu HTML complet avec <h2>, <p>, <ul>, <li>. Minimum 400 mots.",
  "tags": ["tag1", "tag2", "tag3"],
  "read_time": 5
}
PROMPT;
    }

    private function seedDiseases(): void
    {
        $diseases = [
            ['nom' => 'Endométriose', 'slug' => 'endometriose', 'category_slug' => 'gynecologiques', 'is_chronic' => true, 'icd10' => 'N80'],
            ['nom' => 'Syndrome des ovaires polykystiques', 'slug' => 'sopk', 'category_slug' => 'hormonales', 'is_chronic' => true, 'icd10' => 'E28.2'],
            ['nom' => 'Fibrome utérin', 'slug' => 'fibrome-uterin', 'category_slug' => 'gynecologiques', 'is_chronic' => false, 'icd10' => 'D25'],
            ['nom' => 'Candidose vaginale', 'slug' => 'candidose', 'category_slug' => 'infectieuses', 'is_chronic' => false, 'icd10' => 'B37.3'],
            ['nom' => 'Cancer du col de l\'utérus', 'slug' => 'cancer-col-uterus', 'category_slug' => 'cancerologie', 'is_chronic' => false, 'icd10' => 'C53'],
            ['nom' => 'Prééclampsie', 'slug' => 'preeclampsie', 'category_slug' => 'grossesse', 'is_chronic' => false, 'icd10' => 'O14'],
            ['nom' => 'Vaginose bactérienne', 'slug' => 'vaginose', 'category_slug' => 'infectieuses', 'is_chronic' => false, 'icd10' => 'N76.0'],
            ['nom' => 'Dysménorrhée', 'slug' => 'dysmenorrhee', 'category_slug' => 'gynecologiques', 'is_chronic' => false, 'icd10' => 'N94.6'],
        ];

        $bar = $this->command->getOutput()->createProgressBar(count($diseases));
        $bar->start();

        foreach ($diseases as $d) {
            if (Disease::where('slug', $d['slug'])->exists()) {
                $bar->advance();
                continue;
            }

            $category = DiseaseCategory::where('slug', $d['category_slug'])->first();
            $json = $this->callGemini($this->diseasePrompt($d['nom']));
            if (!$json) {
                $bar->advance();
                sleep(2);
                continue;
            }

            $disease = Disease::create([
                'nom' => $d['nom'],
                'scientific_nom' => $json['scientific_nom'] ?? null,
                'slug' => $d['slug'],
                'category_id' => $category?->id,
                'description' => $json['description'] ?? '',
                'common_symptoms' => $json['common_symptoms'] ?? [],
                'causes' => $json['causes'] ?? '',
                'risk_factors' => $json['risk_factors'] ?? [],
                'diagnosis_methods' => $json['diagnosis_methods'] ?? [],
                'treatment_overview' => $json['treatment_overview'] ?? '',
                'prevention_tips' => $json['prevention_tips'] ?? [],
                'complications' => $json['complications'] ?? '',
                'when_to_see_doctor' => $json['when_to_see_doctor'] ?? '',
                'specialistes' => $json['specialistes'] ?? [],
                'is_chronic' => $d['is_chronic'],
                'icd10_code' => $d['icd10'],
                'disclaimer' => '⚠️ Ces informations sont éducatives et ne remplacent pas un avis médical professionnel.',
                'is_active' => true,
            ]);

            foreach (($json['symptoms_detail'] ?? []) as $sym) {
                DiseaseSymptom::create([
                    'disease_id' => $disease->id,
                    'symptom_nom' => $sym['nom'] ?? $sym,
                    'is_common' => $sym['is_common'] ?? true,
                    'description' => $sym['description'] ?? null,
                ]);
            }

            foreach (($json['treatments'] ?? []) as $treat) {
                DiseaseTreatment::create([
                    'disease_id' => $disease->id,
                    'treatment_type' => $treat['type'] ?? 'medication',
                    'description' => $treat['description'] ?? '',
                    'is_common' => $treat['is_common'] ?? true,
                ]);
            }

            foreach (array_slice($json['faqs'] ?? [], 0, 4) as $i => $faq) {
                DiseaseFaq::create([
                    'disease_id' => $disease->id,
                    'question' => $faq['question'] ?? '',
                    'answer' => $faq['answer'] ?? '',
                    'display_order' => $i,
                ]);
            }

            $bar->advance();
            sleep(1);
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info('✅ Diseases seeded');
    }

    private function diseasePrompt(string $nom): string
    {
        return <<<PROMPT
Tu es un médecin spécialiste en santé féminine. Fournis des informations médicales complètes en français sur : "{$nom}".

Retourne UNIQUEMENT un objet JSON valide (sans markdown, sans backticks) :
{
  "scientific_nom": "Nom scientifique",
  "description": "Description en 3-4 phrases",
  "common_symptoms": ["symptôme1", "symptôme2", "symptôme3", "symptôme4", "symptôme5"],
  "causes": "Explication des causes en 2-3 phrases",
  "risk_factors": ["facteur1", "facteur2", "facteur3"],
  "diagnosis_methods": ["méthode1", "méthode2", "méthode3"],
  "treatment_overview": "Aperçu des traitements en 2-3 phrases",
  "prevention_tips": ["conseil1", "conseil2", "conseil3"],
  "complications": "Complications possibles",
  "when_to_see_doctor": "Quand consulter un médecin",
  "specialistes": ["gynécologue"],
  "symptoms_detail": [{"nom": "Symptôme", "is_common": true, "description": "Description courte"}],
  "treatments": [{"type": "medication", "description": "Description", "is_common": true}],
  "faqs": [{"question": "Question ?", "answer": "Réponse"}]
}
Types de traitement autorisés : medication, surgery, therapy, lifestyle, alternative
PROMPT;
    }

    private function seedQuizzes(): void
    {
        $quizTopics = [
            ['title' => 'Connaissez-vous votre cycle menstruel ?', 'category' => 'cycle', 'difficulty' => 'beginner'],
            ['title' => 'Quiz grossesse : mythes et réalités', 'category' => 'pregnancy', 'difficulty' => 'intermediate'],
            ['title' => 'Santé féminine : les bases', 'category' => 'general', 'difficulty' => 'beginner'],
            ['title' => 'Maladies gynécologiques courantes', 'category' => 'diseases', 'difficulty' => 'intermediate'],
        ];

        $bar = $this->command->getOutput()->createProgressBar(count($quizTopics));
        $bar->start();

        foreach ($quizTopics as $topic) {
            if (Quiz::where('slug', Str::slug($topic['title']))->exists()) {
                $bar->advance();
                continue;
            }

            $json = $this->callGemini($this->quizPrompt($topic['title'], $topic['category']));
            if (!$json) {
                $bar->advance();
                sleep(2);
                continue;
            }

            $quiz = Quiz::create([
                'title' => $topic['title'],
                'slug' => Str::slug($topic['title']),
                'description' => $json['description'] ?? '',
                'category' => $topic['category'],
                'difficulty' => $topic['difficulty'],
                'passing_score' => 70,
                'time_limit' => 300,
            ]);

            foreach (array_slice($json['questions'] ?? [], 0, 8) as $i => $q) {
                $question = Question::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $q['question'] ?? '',
                    'type' => 'single',
                    'points' => 1,
                    'display_order' => $i + 1,
                    'explanation' => $q['explanation'] ?? null,
                ]);

                foreach (($q['options'] ?? []) as $j => $opt) {
                    QuestionOption::create([
                        'question_id' => $question->id,
                        'option_text' => $opt['text'] ?? $opt,
                        'is_correct' => $opt['is_correct'] ?? false,
                        'display_order' => $j + 1,
                    ]);
                }
            }

            $bar->advance();
            sleep(1);
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info('✅ Quizzes seeded');
    }

    private function quizPrompt(string $title, string $category): string
    {
        return <<<PROMPT
Tu es une experte en santé féminine. Crée un quiz éducatif en français : "{$title}".

Retourne UNIQUEMENT un objet JSON valide (sans markdown, sans backticks) :
{
  "description": "Description courte en 1 phrase",
  "questions": [
    {
      "question": "Texte de la question ?",
      "explanation": "Explication pédagogique",
      "options": [
        {"text": "Option A", "is_correct": false},
        {"text": "Option B", "is_correct": true},
        {"text": "Option C", "is_correct": false},
        {"text": "Option D", "is_correct": false}
      ]
    }
  ]
}
Génère exactement 8 questions sur le thème "{$category}". Une seule bonne réponse par question.
PROMPT;
    }

    private function callGemini(string $prompt): ?array
    {
        try {
            $response = Http::timeout(30)->post("{$this->apiUrl}?key={$this->apiKey}", [
                'contents' => [
                    ['role' => 'user', 'parts' => [['text' => $prompt]]],
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 2048,
                ],
            ]);

            if (!$response->successful())
                return null;

            $text = $response->json('candidates.0.content.parts.0.text');
            if (!$text)
                return null;

            $text = preg_replace('/^```json\s*/m', '', $text);
            $text = preg_replace('/^```\s*/m', '', $text);

            return json_decode(trim($text), true);

        } catch (\Throwable $e) {
            $this->command->warn('Gemini error: ' . $e->getMessage());
            return null;
        }
    }
}
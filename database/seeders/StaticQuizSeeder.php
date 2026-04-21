<?php

namespace Database\Seeders;

use App\Models\Quiz\Quiz;
use App\Models\Quiz\Question;
use App\Models\Quiz\QuestionOption;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StaticQuizSeeder extends Seeder
{
    public function run(): void
    {
        $quizzes = [
            [
                'title' => 'Connaissez-vous votre cycle menstruel ?',
                'slug' => 'cycle-menstruel-quiz',
                'description' => 'Testez vos connaissances sur les phases et le fonctionnement du cycle menstruel.',
                'category' => 'cycle',
                'difficulty' => 'beginner',
                'time_limit' => 300,
                'passing_score' => 70,
                'questions' => [
                    [
                        'text' => 'Combien de phases comporte un cycle menstruel typique ?',
                        'explanation' => 'Le cycle menstruel comporte 4 phases : menstruelle, folliculaire, ovulatoire et lutéale.',
                        'options' => [
                            ['text' => '2 phases', 'is_correct' => false],
                            ['text' => '3 phases', 'is_correct' => false],
                            ['text' => '4 phases', 'is_correct' => true],
                            ['text' => '5 phases', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quelle est la durée moyenne d\'un cycle menstruel ?',
                        'explanation' => 'Un cycle normal peut durer entre 21 et 35 jours, avec une moyenne de 28 jours.',
                        'options' => [
                            ['text' => '21 jours', 'is_correct' => false],
                            ['text' => '28 jours', 'is_correct' => false],
                            ['text' => '35 jours', 'is_correct' => false],
                            ['text' => 'Entre 21 et 35 jours', 'is_correct' => true],
                        ],
                    ],
                    [
                        'text' => 'Quand l\'ovulation se produit-elle généralement ?',
                        'explanation' => 'L\'ovulation se produit généralement autour du 14ème jour dans un cycle de 28 jours.',
                        'options' => [
                            ['text' => 'Jour 1-5', 'is_correct' => false],
                            ['text' => 'Jour 7-10', 'is_correct' => false],
                            ['text' => 'Jour 12-16', 'is_correct' => true],
                            ['text' => 'Jour 20-25', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Qu\'est-ce que le SPM ?',
                        'explanation' => 'Le SPM (Syndrome Prémenstruel) désigne l\'ensemble des symptômes physiques et émotionnels survenant avant les règles.',
                        'options' => [
                            ['text' => 'Syndrome Post-Menstruel', 'is_correct' => false],
                            ['text' => 'Syndrome Prémenstruel', 'is_correct' => true],
                            ['text' => 'Symptômes Pendant la Menstruation', 'is_correct' => false],
                            ['text' => 'Suivi Périodique Mensuel', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quelle hormone déclenche l\'ovulation ?',
                        'explanation' => 'La LH (Hormone Lutéinisante) provoque la libération de l\'ovule par le follicule.',
                        'options' => [
                            ['text' => 'Estrogène', 'is_correct' => false],
                            ['text' => 'Progestérone', 'is_correct' => false],
                            ['text' => 'LH (Hormone Lutéinisante)', 'is_correct' => true],
                            ['text' => 'FSH', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Combien de jours durent les règles en moyenne ?',
                        'explanation' => 'Les règles durent en moyenne entre 3 et 7 jours.',
                        'options' => [
                            ['text' => '1-2 jours', 'is_correct' => false],
                            ['text' => '3-7 jours', 'is_correct' => true],
                            ['text' => '10-12 jours', 'is_correct' => false],
                            ['text' => '14 jours', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Qu\'est-ce que la dysménorrhée ?',
                        'explanation' => 'La dysménorrhée désigne les douleurs menstruelles (crampes) avant ou pendant les règles.',
                        'options' => [
                            ['text' => 'L\'absence de règles', 'is_correct' => false],
                            ['text' => 'Des règles abondantes', 'is_correct' => false],
                            ['text' => 'Des douleurs menstruelles', 'is_correct' => true],
                            ['text' => 'Des règles irrégulières', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quelle phase suit immédiatement l\'ovulation ?',
                        'explanation' => 'La phase lutéale commence après l\'ovulation et dure jusqu\'au début des règles suivantes.',
                        'options' => [
                            ['text' => 'Phase menstruelle', 'is_correct' => false],
                            ['text' => 'Phase folliculaire', 'is_correct' => false],
                            ['text' => 'Phase lutéale', 'is_correct' => true],
                            ['text' => 'Phase proliférative', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Quiz grossesse : mythes et réalités',
                'slug' => 'grossesse-mythes-realites',
                'description' => 'Démêlez le vrai du faux sur la grossesse et la maternité.',
                'category' => 'pregnancy',
                'difficulty' => 'intermediate',
                'time_limit' => 300,
                'passing_score' => 70,
                'questions' => [
                    [
                        'text' => 'Quand peut-on détecter une grossesse avec un test urinaire ?',
                        'explanation' => 'Les tests de grossesse détectent l\'hCG dans les urines, généralement à partir du premier jour de retard des règles.',
                        'options' => [
                            ['text' => 'Dès la conception', 'is_correct' => false],
                            ['text' => 'À partir du premier jour de retard', 'is_correct' => true],
                            ['text' => 'Après 2 mois', 'is_correct' => false],
                            ['text' => 'Seulement par prise de sang', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Combien de trimestres dure une grossesse ?',
                        'explanation' => 'Une grossesse dure environ 40 semaines, divisées en 3 trimestres.',
                        'options' => [
                            ['text' => '2 trimestres', 'is_correct' => false],
                            ['text' => '3 trimestres', 'is_correct' => true],
                            ['text' => '4 trimestres', 'is_correct' => false],
                            ['text' => '5 trimestres', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quel nutriment est essentiel en début de grossesse pour prévenir les malformations ?',
                        'explanation' => 'L\'acide folique (vitamine B9) est crucial pour prévenir les malformations du tube neural.',
                        'options' => [
                            ['text' => 'Vitamine C', 'is_correct' => false],
                            ['text' => 'Calcium', 'is_correct' => false],
                            ['text' => 'Acide folique', 'is_correct' => true],
                            ['text' => 'Fer', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'À quel mois commence généralement à se voir le ventre ?',
                        'explanation' => 'Pour une première grossesse, le ventre devient visible entre le 4ème et le 5ème mois.',
                        'options' => [
                            ['text' => '1er mois', 'is_correct' => false],
                            ['text' => '2ème mois', 'is_correct' => false],
                            ['text' => '4ème-5ème mois', 'is_correct' => true],
                            ['text' => '7ème mois', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quand les premiers mouvements du bébé sont-ils ressentis ?',
                        'explanation' => 'Les premiers mouvements foetaux sont généralement ressentis entre la 18ème et la 25ème semaine.',
                        'options' => [
                            ['text' => 'Semaine 8-10', 'is_correct' => false],
                            ['text' => 'Semaine 18-25', 'is_correct' => true],
                            ['text' => 'Semaine 30-35', 'is_correct' => false],
                            ['text' => 'Seulement à la fin', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Qu\'est-ce que la prééclampsie ?',
                        'explanation' => 'La prééclampsie est une complication caractérisée par une hypertension et des protéines dans les urines pendant la grossesse.',
                        'options' => [
                            ['text' => 'Des nausées matinales', 'is_correct' => false],
                            ['text' => 'Une hypertension pendant la grossesse', 'is_correct' => true],
                            ['text' => 'Un diabète gestationnel', 'is_correct' => false],
                            ['text' => 'Une anémie', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Combien de semaines dure une grossesse à terme ?',
                        'explanation' => 'Une grossesse à terme dure entre 37 et 42 semaines d\'aménorrhée.',
                        'options' => [
                            ['text' => '32 semaines', 'is_correct' => false],
                            ['text' => '36 semaines', 'is_correct' => false],
                            ['text' => '40 semaines', 'is_correct' => true],
                            ['text' => '45 semaines', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Le sport est-il autorisé pendant la grossesse ?',
                        'explanation' => 'Le sport modéré est recommandé pendant la grossesse, sauf contre-indication médicale.',
                        'options' => [
                            ['text' => 'Non, jamais', 'is_correct' => false],
                            ['text' => 'Oui, le sport modéré est recommandé', 'is_correct' => true],
                            ['text' => 'Seulement au 1er trimestre', 'is_correct' => false],
                            ['text' => 'Seulement la natation', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Santé féminine : les bases',
                'slug' => 'sante-feminine-bases',
                'description' => 'Questions essentielles sur la santé et le bien-être de la femme.',
                'category' => 'general',
                'difficulty' => 'beginner',
                'time_limit' => 300,
                'passing_score' => 70,
                'questions' => [
                    [
                        'text' => 'À quelle fréquence faut-il consulter un gynécologue ?',
                        'explanation' => 'Il est recommandé de consulter un gynécologue au moins une fois par an pour un suivi régulier.',
                        'options' => [
                            ['text' => 'Tous les 5 ans', 'is_correct' => false],
                            ['text' => 'Une fois par an', 'is_correct' => true],
                            ['text' => 'Seulement en cas de problème', 'is_correct' => false],
                            ['text' => 'Tous les 10 ans', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Qu\'est-ce que l\'endométriose ?',
                        'explanation' => 'L\'endométriose est une maladie où du tissu semblable à l\'endomètre se développe en dehors de l\'utérus.',
                        'options' => [
                            ['text' => 'Une infection vaginale', 'is_correct' => false],
                            ['text' => 'Du tissu utérin qui se développe hors de l\'utérus', 'is_correct' => true],
                            ['text' => 'Un cancer de l\'utérus', 'is_correct' => false],
                            ['text' => 'Une maladie hormonale', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quel vaccin protège contre le cancer du col de l\'utérus ?',
                        'explanation' => 'Le vaccin HPV protège contre le papillomavirus humain, principale cause du cancer du col de l\'utérus.',
                        'options' => [
                            ['text' => 'Vaccin BCG', 'is_correct' => false],
                            ['text' => 'Vaccin HPV', 'is_correct' => true],
                            ['text' => 'Vaccin hépatite B', 'is_correct' => false],
                            ['text' => 'Vaccin grippe', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Qu\'est-ce que le SOPK ?',
                        'explanation' => 'Le SOPK (Syndrome des Ovaires Polykystiques) est un trouble hormonal causant des cycles irréguliers et des kystes ovariens.',
                        'options' => [
                            ['text' => 'Syndrome Osseux Post-Ménopause', 'is_correct' => false],
                            ['text' => 'Syndrome des Ovaires Polykystiques', 'is_correct' => true],
                            ['text' => 'Suivi Obstétrical Post-Kyste', 'is_correct' => false],
                            ['text' => 'Symptômes Ovariens Périodiques Kystiques', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'À quel âge débute généralement la ménopause ?',
                        'explanation' => 'La ménopause survient généralement entre 45 et 55 ans, avec une moyenne autour de 51 ans.',
                        'options' => [
                            ['text' => '35-40 ans', 'is_correct' => false],
                            ['text' => '45-55 ans', 'is_correct' => true],
                            ['text' => '60-65 ans', 'is_correct' => false],
                            ['text' => '70 ans', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quelle est la meilleure position pour l\'auto-examen des seins ?',
                        'explanation' => 'L\'auto-examen se fait idéalement allongée, avec le bras levé du côté examiné.',
                        'options' => [
                            ['text' => 'Debout uniquement', 'is_correct' => false],
                            ['text' => 'Allongée avec bras levé', 'is_correct' => true],
                            ['text' => 'Assise', 'is_correct' => false],
                            ['text' => 'La position n\'a pas d\'importance', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Qu\'est-ce qu\'une infection urinaire ?',
                        'explanation' => 'Une infection urinaire est causée par des bactéries dans les voies urinaires, très fréquente chez la femme.',
                        'options' => [
                            ['text' => 'Une infection des ovaires', 'is_correct' => false],
                            ['text' => 'Une infection bactérienne des voies urinaires', 'is_correct' => true],
                            ['text' => 'Une infection vaginale', 'is_correct' => false],
                            ['text' => 'Un problème rénal', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Combien d\'eau faut-il boire par jour ?',
                        'explanation' => 'Il est recommandé de boire environ 1,5 à 2 litres d\'eau par jour pour rester hydratée.',
                        'options' => [
                            ['text' => '0,5 litre', 'is_correct' => false],
                            ['text' => '1 litre', 'is_correct' => false],
                            ['text' => '1,5 à 2 litres', 'is_correct' => true],
                            ['text' => '4 litres', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Maladies gynécologiques courantes',
                'slug' => 'maladies-gynecologiques',
                'description' => 'Testez vos connaissances sur les principales maladies gynécologiques.',
                'category' => 'diseases',
                'difficulty' => 'intermediate',
                'time_limit' => 300,
                'passing_score' => 70,
                'questions' => [
                    [
                        'text' => 'Quelle maladie est caractérisée par des fibromes dans l\'utérus ?',
                        'explanation' => 'Les fibromes utérins sont des tumeurs bénignes qui se développent dans ou autour de l\'utérus.',
                        'options' => [
                            ['text' => 'Endométriose', 'is_correct' => false],
                            ['text' => 'Fibrome utérin', 'is_correct' => true],
                            ['text' => 'SOPK', 'is_correct' => false],
                            ['text' => 'Candidose', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quelle est la cause principale de la candidose vaginale ?',
                        'explanation' => 'La candidose est causée par une prolifération du champignon Candida albicans.',
                        'options' => [
                            ['text' => 'Une bactérie', 'is_correct' => false],
                            ['text' => 'Un virus', 'is_correct' => false],
                            ['text' => 'Un champignon (Candida)', 'is_correct' => true],
                            ['text' => 'Un parasite', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quel examen permet de dépister le cancer du col de l\'utérus ?',
                        'explanation' => 'Le frottis cervico-utérin (FCU) ou test de Papanicolaou permet de détecter les cellules anormales.',
                        'options' => [
                            ['text' => 'Mammographie', 'is_correct' => false],
                            ['text' => 'Frottis cervico-utérin', 'is_correct' => true],
                            ['text' => 'Échographie', 'is_correct' => false],
                            ['text' => 'Prise de sang', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'L\'endométriose peut-elle causer l\'infertilité ?',
                        'explanation' => 'Oui, l\'endométriose est l\'une des principales causes d\'infertilité féminine.',
                        'options' => [
                            ['text' => 'Non, jamais', 'is_correct' => false],
                            ['text' => 'Oui, c\'est une cause fréquente d\'infertilité', 'is_correct' => true],
                            ['text' => 'Seulement chez les femmes de plus de 40 ans', 'is_correct' => false],
                            ['text' => 'Seulement si non traitée pendant 10 ans', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Qu\'est-ce que la vaginose bactérienne ?',
                        'explanation' => 'La vaginose bactérienne est un déséquilibre de la flore vaginale causé par une prolifération de certaines bactéries.',
                        'options' => [
                            ['text' => 'Une infection à champignons', 'is_correct' => false],
                            ['text' => 'Un déséquilibre de la flore vaginale', 'is_correct' => true],
                            ['text' => 'Une infection sexuellement transmissible', 'is_correct' => false],
                            ['text' => 'Une inflammation de l\'utérus', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quel symptôme est caractéristique du SOPK ?',
                        'explanation' => 'Le SOPK se manifeste souvent par des cycles menstruels irréguliers ou absents.',
                        'options' => [
                            ['text' => 'Des douleurs pendant les rapports', 'is_correct' => false],
                            ['text' => 'Des cycles menstruels irréguliers', 'is_correct' => true],
                            ['text' => 'Des saignements abondants', 'is_correct' => false],
                            ['text' => 'De la fièvre', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'À quelle fréquence faire une mammographie après 50 ans ?',
                        'explanation' => 'Après 50 ans, une mammographie tous les 2 ans est recommandée dans le cadre du dépistage organisé.',
                        'options' => [
                            ['text' => 'Tous les ans', 'is_correct' => false],
                            ['text' => 'Tous les 2 ans', 'is_correct' => true],
                            ['text' => 'Tous les 5 ans', 'is_correct' => false],
                            ['text' => 'Une seule fois', 'is_correct' => false],
                        ],
                    ],
                    [
                        'text' => 'Quel est le traitement principal de l\'endométriose ?',
                        'explanation' => 'L\'endométriose peut être traitée par hormonothérapie ou chirurgie selon la sévérité.',
                        'options' => [
                            ['text' => 'Antibiotiques', 'is_correct' => false],
                            ['text' => 'Hormonothérapie ou chirurgie', 'is_correct' => true],
                            ['text' => 'Vitamines uniquement', 'is_correct' => false],
                            ['text' => 'Aucun traitement n\'existe', 'is_correct' => false],
                        ],
                    ],
                ],
            ],
        ];

        $this->command->info('📝 Seeding quizzes...');
        $bar = $this->command->getOutput()->createProgressBar(count($quizzes));
        $bar->start();

        foreach ($quizzes as $quizData) {
            if (Quiz::where('slug', $quizData['slug'])->exists()) {
                $bar->advance();
                continue;
            }

            $quiz = Quiz::create([
                'title' => $quizData['title'],
                'slug' => $quizData['slug'],
                'description' => $quizData['description'],
                'category' => $quizData['category'],
                'difficulty' => $quizData['difficulty'],
                'time_limit' => $quizData['time_limit'],
                'passing_score' => $quizData['passing_score'],
                'attempt_count' => rand(10, 200),
                'average_score' => rand(60, 90),
            ]);

            foreach ($quizData['questions'] as $i => $qData) {
                $question = Question::create([
                    'quiz_id' => $quiz->id,
                    'question_text' => $qData['text'],
                    'type' => 'single',
                    'points' => 1,
                    'display_order' => $i + 1,
                    'explanation' => $qData['explanation'],
                ]);

                foreach ($qData['options'] as $j => $opt) {
                    QuestionOption::create([
                        'question_id' => $question->id,
                        'option_text' => $opt['text'],
                        'is_correct' => $opt['is_correct'],
                        'display_order' => $j + 1,
                    ]);
                }
            }

            $bar->advance();
        }

        $bar->finish();
        $this->command->newLine();
        $this->command->info('✅ ' . Quiz::count() . ' quizzes seeded with ' . Question::count() . ' questions!');
    }
}
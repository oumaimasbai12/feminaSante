<?php

namespace App\Services;

use App\Models\AppNotification;
use App\Models\Pregnancy\Pregnancy;
use App\Models\Pregnancy\PregnancyMilestone;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Schema;

class PregnancyService
{
    public function getGestationalWeek(Pregnancy $pregnancy, ?Carbon $reference = null): int
    {
        if (! $pregnancy->start_date) {
            return 1;
        }

        $reference ??= Carbon::today();
        $days = $pregnancy->start_date->diffInDays($reference, false);

        return max(1, min(42, (int) floor($days / 7) + 1));
    }

    public function getProgressPercent(int $week, int $totalWeeks = 40): float
    {
        return round(min(100, max(0, ($week / $totalWeeks) * 100)), 1);
    }

    public function getTrimester(int $week): int
    {
        if ($week <= 12) {
            return 1;
        }

        if ($week <= 26) {
            return 2;
        }

        return 3;
    }

    public function getWeeklyTip(int $week): array
    {
        $tips = config('pregnancy.weekly_tips', []);
        $matchedWeek = collect(array_keys($tips))
            ->filter(fn (int $w) => $w <= $week)
            ->sort()
            ->last();

        $tip = $tips[$matchedWeek] ?? [
            'title' => 'Semaine '.$week,
            'tip' => 'Continuez vos consultations régulières et notez vos symptômes pour en discuter avec votre professionnel de santé.',
            'baby_size' => 'Votre bébé grandit chaque jour',
        ];

        return [
            'week' => $week,
            'title' => $tip['title'],
            'tip' => $tip['tip'],
            'baby_size' => $tip['baby_size'],
            'trimester' => $this->getTrimester($week),
        ];
    }

    public function scheduleMilestones(Pregnancy $pregnancy): Collection
    {
        $definitions = config('pregnancy.milestones', []);
        $created = collect();

        foreach ($definitions as $definition) {
            $scheduledDate = $pregnancy->start_date->copy()->addWeeks($definition['week']);

            $milestone = PregnancyMilestone::firstOrCreate(
                [
                    'pregnancy_id' => $pregnancy->id,
                    'week' => $definition['week'],
                    'checkup_type' => $definition['checkup_type'],
                ],
                [
                    'title' => $definition['title'],
                    'description' => $definition['description'],
                    'scheduled_date' => $scheduledDate->toDateString(),
                    'status' => 'pending',
                ]
            );

            $created->push($milestone);
        }

        return $created;
    }

    public function notifyPregnancyStarted(Pregnancy $pregnancy): void
    {
        $week = $this->getGestationalWeek($pregnancy);

        AppNotification::create([
            'user_id' => $pregnancy->user_id,
            'type' => 'pregnancy',
            'title' => 'Suivi de grossesse activé',
            'message' => "Vous êtes à la semaine {$week}. Vos rendez-vous médicaux ont été planifiés automatiquement.",
            'data' => [
                'pregnancy_id' => $pregnancy->id,
                'current_week' => $week,
            ],
        ]);
    }

    public function getDashboard(Pregnancy $pregnancy): array
    {
        if ($pregnancy->statuts === 'ongoing' && $pregnancy->milestones()->count() === 0) {
            $this->scheduleMilestones($pregnancy);
        }

        $pregnancy->load([
            'milestones' => fn ($query) => $query->orderBy('scheduled_date'),
            'weightGains' => fn ($query) => $query->orderBy('date'),
            'checkups' => fn ($query) => $query->latest('checkup_date')->limit(3),
        ]);

        $week = $this->getGestationalWeek($pregnancy);
        $dueDate = $pregnancy->due_date ?? $pregnancy->start_date->copy()->addDays(config('pregnancy.default_cycle_days', 280));

        return [
            'pregnancy' => $pregnancy,
            'current_week' => $week,
            'progress_percent' => $this->getProgressPercent($week),
            'trimester' => $this->getTrimester($week),
            'weeks_remaining' => max(0, 40 - $week),
            'due_date' => $dueDate->toDateString(),
            'weekly_tip' => $this->getWeeklyTip($week),
            'milestones' => $pregnancy->milestones,
            'upcoming_milestones' => $pregnancy->milestones
                ->where('status', 'pending')
                ->where('scheduled_date', '>=', Carbon::today())
                ->take(3)
                ->values(),
            'weight_chart' => $pregnancy->weightGains->map(fn ($entry) => [
                'date' => $entry->date->toDateString(),
                'week' => $entry->week,
                'weight' => (float) $entry->weight,
            ])->values(),
            'recent_checkups' => $pregnancy->checkups,
        ];
    }

    public function buildMedicalExport(Pregnancy $pregnancy): array
    {
        if (! $pregnancy->start_date) {
            throw new \InvalidArgumentException('La date des dernières règles est requise pour générer le PDF.');
        }

        $relations = [
            'milestones',
            'checkups',
            'weightGains',
            'kickCounters',
            'contractions',
            'user:id,nom,email,birth_date,blood_type',
        ];

        if (Schema::hasTable('pregnancy_symptoms')) {
            $relations[] = 'symptoms';
        }

        $pregnancy->load($relations);

        $week = $this->getGestationalWeek($pregnancy);

        return [
            'generated_at' => now()->toIso8601String(),
            'disclaimer' => 'Ce document est un résumé informatif et ne remplace pas un dossier médical officiel.',
            'patient' => [
                'name' => $pregnancy->user?->nom,
                'email' => $pregnancy->user?->email,
                'birth_date' => $pregnancy->user?->birth_date?->toDateString(),
                'blood_type' => $pregnancy->user?->blood_type,
            ],
            'pregnancy' => [
                'start_date' => $pregnancy->start_date->toDateString(),
                'due_date' => $pregnancy->due_date?->toDateString(),
                'current_week' => $week,
                'pregnancy_type' => $pregnancy->pregnancy_type ?? 'simple',
                'statuts' => $pregnancy->statuts ?? 'ongoing',
                'high_risk' => (bool) $pregnancy->high_risk,
                'risk_factors' => $pregnancy->risk_factors,
                'allergies' => $pregnancy->allergies,
                'medical_conditions' => $pregnancy->medical_conditions,
                'notes' => $pregnancy->notes,
            ],
            'milestones' => $pregnancy->milestones,
            'checkups' => $pregnancy->checkups,
            'weight_gains' => $pregnancy->weightGains,
            'kick_counters' => $pregnancy->kickCounters,
            'contractions' => $pregnancy->contractions,
            'symptoms' => $pregnancy->relationLoaded('symptoms') ? $pregnancy->symptoms : collect(),
            'weekly_tip' => $this->getWeeklyTip($week),
        ];
    }

    public function generateMedicalExportPdf(Pregnancy $pregnancy)
    {
        $export = $this->buildMedicalExport($pregnancy);

        return Pdf::loadView('exports.pregnancy-medical-summary', compact('export'))
            ->setPaper('a4', 'portrait')
            ->setOption('isRemoteEnabled', false)
            ->setOption('defaultFont', 'DejaVu Sans');
    }

    public function sendWeeklyReminders(): int
    {
        $count = 0;
        $today = Carbon::today();

        Pregnancy::query()
            ->where('statuts', 'ongoing')
            ->with('user')
            ->chunkById(50, function ($pregnancies) use (&$count, $today) {
                foreach ($pregnancies as $pregnancy) {
                    $week = $this->getGestationalWeek($pregnancy, $today);
                    $tip = $this->getWeeklyTip($week);

                    $alreadySent = AppNotification::query()
                        ->where('user_id', $pregnancy->user_id)
                        ->where('type', 'pregnancy')
                        ->whereDate('created_at', $today)
                        ->where('data->pregnancy_id', $pregnancy->id)
                        ->where('data->kind', 'weekly_progress')
                        ->exists();

                    if ($alreadySent) {
                        continue;
                    }

                    AppNotification::create([
                        'user_id' => $pregnancy->user_id,
                        'type' => 'pregnancy',
                        'title' => "Semaine {$week} de grossesse",
                        'message' => $tip['tip'],
                        'data' => [
                            'kind' => 'weekly_progress',
                            'pregnancy_id' => $pregnancy->id,
                            'current_week' => $week,
                        ],
                    ]);

                    $count++;

                    $pregnancy->milestones()
                        ->where('status', 'pending')
                        ->whereDate('scheduled_date', $today)
                        ->whereNull('reminder_sent_at')
                        ->get()
                        ->each(function (PregnancyMilestone $milestone) use ($pregnancy) {
                            AppNotification::create([
                                'user_id' => $pregnancy->user_id,
                                'type' => 'pregnancy',
                                'title' => 'Rendez-vous prévu aujourd\'hui',
                                'message' => $milestone->title.' — '.$milestone->description,
                                'data' => [
                                    'kind' => 'milestone_reminder',
                                    'pregnancy_id' => $pregnancy->id,
                                    'milestone_id' => $milestone->id,
                                ],
                            ]);

                            $milestone->update(['reminder_sent_at' => now()]);
                        });
                }
            });

        return $count;
    }
}

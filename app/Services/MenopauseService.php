<?php

namespace App\Services;

use App\Enums\Menopause\MenopauseStageEnum;
use App\Models\AppNotification;
use App\Models\Menopause\Menopause;
use App\Models\Menopause\MenopauseSymptom;
use App\Models\Menopause\MenopauseSymptomLog;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class MenopauseService
{
    public function isEligibleAge(int $age): bool
    {
        return $age >= (int) config('menopause.min_tracking_age', 45);
    }

    public function isUserEligible(?\App\Models\User $user): bool
    {
        if (! $user?->birth_date) {
            return false;
        }

        return $this->isEligibleAge((int) $user->birth_date->age);
    }

    /**
     * Clinical 12-month rule: ≥ 12 months without menstruation → post-menopause, else perimenopause.
     */
    public function classifyStage(?Carbon $lastPeriodDate, ?Carbon $reference = null): MenopauseStageEnum
    {
        if (! $lastPeriodDate) {
            return MenopauseStageEnum::PERIMENOPAUSE;
        }

        $reference ??= Carbon::today();
        $monthsWithoutPeriod = $lastPeriodDate->diffInMonths($reference);

        if ($monthsWithoutPeriod >= config('menopause.postmenopause_months', 12)) {
            return MenopauseStageEnum::POSTMENOPAUSE;
        }

        return MenopauseStageEnum::PERIMENOPAUSE;
    }

    public function monthsSinceLastPeriod(Menopause $menopause, ?Carbon $reference = null): ?int
    {
        if (! $menopause->last_period_date) {
            return null;
        }

        $reference ??= Carbon::today();

        return (int) $menopause->last_period_date->diffInMonths($reference);
    }

    /**
     * Apply profiling data and auto-classify stage via the 12-month decision engine.
     */
    public function applyProfiling(Menopause $menopause, array $data): Menopause
    {
        if (isset($data['last_period_date'])) {
            $lastPeriod = Carbon::parse($data['last_period_date']);
            $data['stage'] = $this->classifyStage($lastPeriod)->value;
        }

        $menopause->update($data);

        return $menopause->fresh();
    }

    public function createProfile(int $userId, array $data): Menopause
    {
        $lastPeriod = isset($data['last_period_date'])
            ? Carbon::parse($data['last_period_date'])
            : null;

        $stage = $lastPeriod
            ? $this->classifyStage($lastPeriod)
            : MenopauseStageEnum::tryFrom($data['stage'] ?? 'perimenopause') ?? MenopauseStageEnum::PERIMENOPAUSE;

        $menopause = Menopause::create([
            ...$data,
            'user_id' => $userId,
            'stage' => $stage,
            'status' => $data['status'] ?? 'ongoing',
        ]);

        $this->notifyProfileCreated($menopause);

        return $menopause;
    }

    /**
     * Sync pivot table entries for catalog symptoms on a daily log.
     *
     * @param  array<int, array{id?: int, symptom_id?: int, intensity?: int}|int>  $symptoms
     */
    public function syncLogSymptoms(MenopauseSymptomLog $log, array $symptoms): void
    {
        if (empty($symptoms)) {
            $log->catalogSymptoms()->detach();

            return;
        }

        $syncData = [];
        foreach ($symptoms as $entry) {
            if (is_int($entry)) {
                $syncData[$entry] = ['intensity' => 2];
                continue;
            }

            $id = $entry['symptom_id'] ?? $entry['id'] ?? null;
            if ($id) {
                $syncData[$id] = ['intensity' => min(3, max(1, (int) ($entry['intensity'] ?? 2)))];
            }
        }

        $log->catalogSymptoms()->sync($syncData);

        // Keep legacy boolean flags in sync with catalog slugs for backward compatibility.
        $slugs = MenopauseSymptom::whereIn('id', array_keys($syncData))->pluck('slug');
        $log->update([
            'hot_flashes' => $slugs->contains('hot_flashes'),
            'night_sweats' => $slugs->contains('night_sweats'),
            'mood_changes' => $slugs->contains('mood_changes'),
            'sleep_changes' => $slugs->contains('sleep_changes'),
        ]);
    }

    public function getSymptomCatalog(): array
    {
        return MenopauseSymptom::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'slug', 'name_fr', 'category'])
            ->all();
    }

    public function getDashboard(Menopause $menopause): array
    {
        $menopause->load([
            'symptomLogs' => fn ($q) => $q->with('catalogSymptoms')->latest('log_date')->limit(90),
            'treatments' => fn ($q) => $q->where('status', 'active')->latest('start_date'),
        ]);

        $logs = $menopause->symptomLogs;
        $monthsWithout = $this->monthsSinceLastPeriod($menopause);
        $computedStage = $this->classifyStage($menopause->last_period_date);

        // Re-classify stored stage if last_period_date implies a change.
        if ($menopause->last_period_date && $menopause->stage !== $computedStage) {
            $menopause->update(['stage' => $computedStage]);
            $menopause->refresh();
        }

        $stageKey = $menopause->stage->value ?? $menopause->stage;
        $stageTip = config("menopause.stage_tips.{$stageKey}", config('menopause.stage_tips.perimenopause'));

        return [
            'profile' => [
                'id' => $menopause->id,
                'stage' => $menopause->stage,
                'stage_label' => $this->stageLabel($menopause->stage),
                'status' => $menopause->status,
                'last_period_date' => $menopause->last_period_date?->toDateString(),
                'diagnosis_date' => $menopause->diagnosis_date?->toDateString(),
                'age_at_onset' => $menopause->age_at_onset,
                'symptom_history_months' => $menopause->symptom_history_months,
                'months_without_period' => $monthsWithout,
                'months_until_postmenopause' => $monthsWithout !== null
                    ? max(0, config('menopause.postmenopause_months', 12) - $monthsWithout)
                    : null,
                'hormone_therapy' => $menopause->hormone_therapy,
                'cycle_irregularity' => $menopause->cycle_irregularity,
                'notes' => $menopause->notes,
                'profiling_flags' => [
                    'hot_flashes' => $menopause->hot_flashes,
                    'night_sweats' => $menopause->night_sweats,
                    'mood_changes' => $menopause->mood_changes,
                    'sleep_changes' => $menopause->sleep_changes,
                ],
            ],
            'stage_tip' => $stageTip,
            'insights' => $this->buildInsights($logs),
            'charts' => $this->buildChartData($logs),
            'correlations' => $this->analyzeCorrelations($logs),
            'recent_logs' => $logs->take(7)->map(fn (MenopauseSymptomLog $log) => $this->formatLog($log))->values(),
            'active_treatments' => $menopause->treatments->map(fn ($t) => [
                'id' => $t->id,
                'name' => $t->name,
                'treatment_type' => $t->treatment_type,
                'start_date' => $t->start_date?->toDateString(),
            ])->values(),
            'symptom_catalog' => $this->getSymptomCatalog(),
        ];
    }

    public function buildInsights(Collection $logs): ?array
    {
        if ($logs->isEmpty()) {
            return null;
        }

        $last7 = $logs->filter(fn (MenopauseSymptomLog $log) => $log->log_date->gte(Carbon::today()->subDays(7)));

        if ($last7->isEmpty()) {
            return null;
        }

        $avgMood = round($last7->avg(fn ($l) => $l->mood_score ?? 5), 1);
        $avgSleep = round($last7->avg(fn ($l) => $l->sleep_quality ?? 5), 1);
        $avgStress = round($last7->avg(fn ($l) => $l->stress_level ?? 5), 1);

        $sorted = $last7->sortByDesc('log_date')->values();
        $trend = $sorted->count() >= 2 ? [
            'mood' => $this->trendDirection($sorted[0]->mood_score ?? 5, $sorted[1]->mood_score ?? 5),
            'sleep' => $this->trendDirection($sorted[0]->sleep_quality ?? 5, $sorted[1]->sleep_quality ?? 5),
        ] : null;

        return [
            'avg_mood' => $avgMood,
            'avg_sleep' => $avgSleep,
            'avg_stress' => $avgStress,
            'hot_flash_count' => $last7->filter(fn ($l) => $this->logHasSymptom($l, 'hot_flashes'))->count(),
            'night_sweat_count' => $last7->filter(fn ($l) => $this->logHasSymptom($l, 'night_sweats'))->count(),
            'logs_last_7_days' => $last7->count(),
            'trend' => $trend,
        ];
    }

    /**
     * Build time-series chart payloads for mood, sleep, and symptom frequency.
     */
    public function buildChartData(Collection $logs): array
    {
        $last30 = $logs
            ->filter(fn (MenopauseSymptomLog $log) => $log->log_date->gte(Carbon::today()->subDays(30)))
            ->sortBy('log_date')
            ->values();

        return [
            'mood_chart' => $last30->map(fn ($l) => [
                'date' => $l->log_date->toDateString(),
                'value' => $l->mood_score ?? 5,
            ])->values()->all(),
            'sleep_chart' => $last30->map(fn ($l) => [
                'date' => $l->log_date->toDateString(),
                'value' => $l->sleep_quality ?? 5,
            ])->values()->all(),
            'stress_chart' => $last30->map(fn ($l) => [
                'date' => $l->log_date->toDateString(),
                'value' => $l->stress_level ?? 5,
            ])->values()->all(),
            'symptom_frequency' => $this->buildSymptomFrequency($last30),
        ];
    }

    /**
     * Correlate symptom spikes with lifestyle factors using config-driven rules.
     */
    public function analyzeCorrelations(Collection $logs): array
    {
        if ($logs->count() < 3) {
            return [];
        }

        $alerts = [];
        $rules = config('menopause.correlation_rules', []);

        foreach ($rules as $rule) {
            $symptomSlug = $rule['symptom_slug'];
            $factor = $rule['factor'];
            $threshold = $rule['threshold'];

            $highFactorDays = $logs->filter(fn ($l) => ($l->{$factor} ?? 0) >= $threshold);
            if ($highFactorDays->count() < 2) {
                continue;
            }

            $symptomPresent = $highFactorDays->filter(
                fn ($l) => $this->logHasSymptom($l, $symptomSlug)
            );

            $rate = $symptomPresent->count() / max(1, $highFactorDays->count());

            if ($rate >= 0.6 && $symptomPresent->count() >= 2) {
                $alerts[] = [
                    'type' => 'correlation',
                    'severity' => $rate >= 0.8 ? 'high' : 'medium',
                    'symptom' => $symptomSlug,
                    'factor' => $factor,
                    'occurrence_rate' => round($rate * 100),
                    'message' => $rule['message'],
                ];
            }
        }

        return $alerts;
    }

    private function buildSymptomFrequency(Collection $logs): array
    {
        $slugs = ['hot_flashes', 'night_sweats', 'mood_changes', 'sleep_changes'];

        $labels = [
            'hot_flashes' => 'Bouffées de chaleur',
            'night_sweats' => 'Sueurs nocturnes',
            'mood_changes' => 'Sautes d\'humeur',
            'sleep_changes' => 'Troubles du sommeil',
        ];

        return collect($slugs)->map(function (string $slug) use ($logs, $labels) {
            $count = $logs->filter(fn (MenopauseSymptomLog $log) => $this->logHasSymptom($log, $slug))->count();

            return [
                'slug' => $slug,
                'label' => $labels[$slug] ?? $slug,
                'count' => $count,
            ];
        })->values()->all();
    }

    private function formatLog(MenopauseSymptomLog $log): array
    {
        return [
            'id' => $log->id,
            'log_date' => $log->log_date->toDateString(),
            'severity' => $log->severity,
            'mood_score' => $log->mood_score,
            'sleep_quality' => $log->sleep_quality,
            'stress_level' => $log->stress_level,
            'hot_flashes' => $this->logHasSymptom($log, 'hot_flashes'),
            'night_sweats' => $this->logHasSymptom($log, 'night_sweats'),
            'mood_changes' => $this->logHasSymptom($log, 'mood_changes'),
            'sleep_changes' => $this->logHasSymptom($log, 'sleep_changes'),
            'catalog_symptoms' => $log->catalogSymptoms->map(fn ($s) => [
                'id' => $s->id,
                'name_fr' => $s->name_fr,
                'intensity' => $s->pivot->intensity,
            ]),
            'notes' => $log->notes,
        ];
    }

    private function logHasSymptom(MenopauseSymptomLog $log, string $slug): bool
    {
        if (in_array($slug, ['hot_flashes', 'night_sweats', 'mood_changes', 'sleep_changes'], true) && $log->{$slug}) {
            return true;
        }

        if ($log->relationLoaded('catalogSymptoms')) {
            return $log->catalogSymptoms->contains('slug', $slug);
        }

        return $log->catalogSymptoms()->where('slug', $slug)->exists();
    }

    private function trendDirection(float $current, float $previous): string
    {
        if ($current > $previous) {
            return 'up';
        }
        if ($current < $previous) {
            return 'down';
        }

        return 'stable';
    }

    private function stageLabel(MenopauseStageEnum|string $stage): string
    {
        $value = $stage instanceof MenopauseStageEnum ? $stage->value : $stage;

        return match ($value) {
            'perimenopause' => 'Périménopause',
            'menopause' => 'Ménopause',
            'postmenopause' => 'Post-ménopause',
            default => ucfirst($value),
        };
    }

    private function notifyProfileCreated(Menopause $menopause): void
    {
        $stageLabel = $this->stageLabel($menopause->stage);

        AppNotification::create([
            'user_id' => $menopause->user_id,
            'type' => 'menopause',
            'title' => 'Profil ménopause configuré',
            'message' => "Votre profil est classé en {$stageLabel}. Commencez à journaliser vos symptômes pour obtenir des insights personnalisés.",
            'data' => [
                'menopause_id' => $menopause->id,
                'stage' => $menopause->stage->value ?? $menopause->stage,
            ],
        ]);
    }
}

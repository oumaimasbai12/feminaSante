<?php

namespace App\Services;

use App\Models\Appointments\Appointment;
use App\Models\Appointments\ClinicalNote;
use App\Models\Appointments\Gynecologist;
use App\Models\Cycle;
use App\Models\Menopause\Menopause;
use App\Models\Menopause\MenopauseSymptomLog;
use App\Models\Pregnancy\Pregnancy;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class GynecologistPatientService
{
    public function __construct(
        private readonly CycleService $cycleService
    ) {
    }

    public function canAccessPatient(Gynecologist $gynecologist, int $userId): bool
    {
        return Appointment::query()
            ->where('gynecologist_id', $gynecologist->id)
            ->where('user_id', $userId)
            ->exists();
    }

    public function assertCanAccessPatient(Gynecologist $gynecologist, int $userId): void
    {
        if (! $this->canAccessPatient($gynecologist, $userId)) {
            throw ValidationException::withMessages([
                'user_id' => ['Accès refusé : aucun rendez-vous avec cette patiente.'],
            ]);
        }
    }

    public function buildPatientFile(Gynecologist $gynecologist, User $patient): array
    {
        $this->assertCanAccessPatient($gynecologist, $patient->id);

        $cycles = Cycle::with('symptoms')
            ->where('user_id', $patient->id)
            ->orderByDesc('start_date')
            ->limit(6)
            ->get();
        $latestCycle = $cycles->first();
        $avgLength = $this->cycleService->calculateAverageCycleLength($cycles);

        $activePregnancy = Pregnancy::where('user_id', $patient->id)
            ->where('statuts', 'ongoing')
            ->latest('start_date')
            ->first();

        $activeMenopause = Menopause::where('user_id', $patient->id)
            ->where('status', 'ongoing')
            ->latest('diagnosis_date')
            ->first();

        $menopauseLogs = $activeMenopause
            ? MenopauseSymptomLog::where('menopause_id', $activeMenopause->id)
                ->latest('log_date')
                ->limit(14)
                ->get()
            : collect();

        $clinicalNotes = ClinicalNote::where('user_id', $patient->id)
            ->where('gynecologist_id', $gynecologist->id)
            ->latest()
            ->limit(10)
            ->get();

        $appointments = Appointment::with('gynecologist')
            ->where('gynecologist_id', $gynecologist->id)
            ->where('user_id', $patient->id)
            ->orderByDesc('start_time')
            ->limit(10)
            ->get();

        $priority = $gynecologist->patientPriorities()
            ->where('user_id', $patient->id)
            ->value('priority') ?? 'routine';

        $currentState = $this->resolveCurrentState($activePregnancy, $activeMenopause, $latestCycle, $avgLength);

        return [
            'patient' => [
                'id' => $patient->id,
                'nom' => $patient->nom,
                'email' => $patient->email,
                'age' => $patient->age,
                'blood_type' => $patient->blood_type,
            ],
            'priority' => $priority,
            'current_state' => $currentState,
            'pregnancy' => $activePregnancy,
            'menopause' => $activeMenopause ? [
                'profile' => $activeMenopause,
                'recent_logs' => $menopauseLogs,
            ] : null,
            'cycle' => [
                'latest' => $latestCycle,
                'recent' => $cycles,
                'current_day' => $latestCycle
                    ? $this->cycleService->getCurrentCycleDay($latestCycle, $avgLength ?? 28)
                    : null,
                'average_length' => $avgLength,
            ],
            'symptom_timeline' => $this->buildSymptomTimeline($menopauseLogs, $cycles),
            'clinical_notes' => $clinicalNotes,
            'appointments_history' => $appointments,
        ];
    }

    private function resolveCurrentState(?Pregnancy $pregnancy, ?Menopause $menopause, ?Cycle $cycle, ?int $avgLength): array
    {
        if ($pregnancy) {
            return [
                'mode' => 'pregnancy',
                'label' => 'Grossesse en cours',
                'detail' => 'Semaine '.$pregnancy->current_week,
            ];
        }

        if ($menopause) {
            $stage = $menopause->stage?->value ?? $menopause->stage;

            return [
                'mode' => 'menopause',
                'label' => 'Suivi ménopause',
                'detail' => ucfirst(str_replace('_', ' ', (string) $stage)),
            ];
        }

        if ($cycle) {
            $day = $this->cycleService->getCurrentCycleDay($cycle, $avgLength ?? 28);

            return [
                'mode' => 'cycle',
                'label' => 'Suivi du cycle',
                'detail' => 'Jour '.$day.' du cycle',
            ];
        }

        return [
            'mode' => 'none',
            'label' => 'Aucun suivi actif',
            'detail' => null,
        ];
    }

    private function buildSymptomTimeline($menopauseLogs, $cycles): array
    {
        $items = collect();

        foreach ($menopauseLogs as $log) {
            $symptoms = [];
            if ($log->hot_flashes) $symptoms[] = 'Bouffées de chaleur';
            if ($log->night_sweats) $symptoms[] = 'Sueurs nocturnes';
            if ($log->mood_changes) $symptoms[] = 'Humeur';
            if ($log->sleep_changes) $symptoms[] = 'Sommeil';
            if ($log->notes) $symptoms[] = $log->notes;

            $items->push([
                'date' => $log->log_date?->toDateString(),
                'source' => 'menopause',
                'summary' => $symptoms ? implode(', ', $symptoms) : 'Journal ménopause',
                'severity' => $log->severity?->value ?? $log->severity,
            ]);
        }

        foreach ($cycles->take(5) as $cycle) {
            $symptomNames = $cycle->symptoms->pluck('nom')->filter()->all();
            $parts = array_filter([
                $symptomNames ? 'Symptômes: '.implode(', ', $symptomNames) : null,
                $cycle->flow_intensity ? 'Flux: '.$cycle->flow_intensity : null,
                $cycle->mood ? 'Humeur: '.$cycle->mood : null,
                $cycle->notes,
            ]);
            $items->push([
                'date' => $cycle->start_date?->toDateString(),
                'source' => 'cycle',
                'summary' => $parts ? implode(' · ', $parts) : 'Cycle enregistré',
                'severity' => null,
            ]);
        }

        return $items->sortByDesc('date')->values()->take(20)->all();
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listPatients(Gynecologist $gynecologist): array
    {
        $userIds = Appointment::query()
            ->where('gynecologist_id', $gynecologist->id)
            ->distinct()
            ->pluck('user_id');

        if ($userIds->isEmpty()) {
            return [];
        }

        $priorities = $gynecologist->patientPriorities()
            ->whereIn('user_id', $userIds)
            ->pluck('priority', 'user_id');

        return User::query()
            ->whereIn('id', $userIds)
            ->get()
            ->map(function (User $patient) use ($gynecologist, $priorities) {
                $appointments = Appointment::query()
                    ->where('gynecologist_id', $gynecologist->id)
                    ->where('user_id', $patient->id)
                    ->orderByDesc('start_time')
                    ->get();

                $last = $appointments->first();
                $next = $appointments
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->filter(fn ($a) => $a->start_time >= now())
                    ->sortBy('start_time')
                    ->first();

                return [
                    'id' => $patient->id,
                    'nom' => $patient->nom,
                    'email' => $patient->email,
                    'age' => $patient->age,
                    'priority' => $priorities[$patient->id] ?? 'routine',
                    'appointments_count' => $appointments->count(),
                    'last_appointment' => $last ? [
                        'id' => $last->id,
                        'start_time' => $last->start_time,
                        'status' => $last->status,
                        'reason' => $last->reason,
                    ] : null,
                    'next_appointment' => $next ? [
                        'id' => $next->id,
                        'start_time' => $next->start_time,
                        'status' => $next->status,
                    ] : null,
                ];
            })
            ->sortBy([
                fn ($p) => match ($p['priority']) {
                    'emergency' => 0,
                    'follow_up' => 1,
                    default => 2,
                },
                fn ($p) => $p['next_appointment']['start_time'] ?? '9999',
            ])
            ->values()
            ->all();
    }
}

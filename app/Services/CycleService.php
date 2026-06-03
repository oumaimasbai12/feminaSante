<?php

namespace App\Services;

use App\Models\Cycle;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class CycleService
{
    /**
     * Calculate the current cycle day based on the last cycle's start date.
     */
    public function getCurrentCycleDay(?Cycle $lastCycle, ?int $averageCycleLength = 28): int
    {
        if (! $lastCycle) {
            return 1;
        }

        $daysSinceStart = Carbon::parse($lastCycle->start_date)->diffInDays(Carbon::now(), false) + 1;

        if ($averageCycleLength && $daysSinceStart > $averageCycleLength) {
            $daysSinceStart = $daysSinceStart % $averageCycleLength;
            if ($daysSinceStart === 0) {
                $daysSinceStart = $averageCycleLength;
            }
        }

        return max(1, $daysSinceStart);
    }

    /**
     * Calculate average cycle length from past cycles (excluding outliers).
     */
    public function calculateAverageCycleLength(Collection $cycles): ?int
    {
        if ($cycles->count() < 2) {
            return null;
        }

        $lengths = [];

        for ($i = 1; $i < $cycles->count(); $i++) {
            $previousStart = Carbon::parse($cycles[$i - 1]->start_date);
            $currentStart = Carbon::parse($cycles[$i]->start_date);
            $length = $previousStart->diffInDays($currentStart);

            if ($length >= 21 && $length <= 35) {
                $lengths[] = $length;
            }
        }

        if (empty($lengths)) {
            return 28;
        }

        sort($lengths);
        $count = count($lengths);

        if ($count >= 5) {
            $trimmed = array_slice($lengths, 1, $count - 2);
            return round(array_sum($trimmed) / count($trimmed));
        }

        return round(array_sum($lengths) / $count);
    }

    /**
     * Calculate the next expected period date.
     */
    public function calculateNextPeriod(Cycle $lastCycle, int $averageCycleLength): Carbon
    {
        return Carbon::parse($lastCycle->start_date)->addDays($averageCycleLength);
    }

    /**
     * Calculate ovulation date (14 days before next period).
     */
    public function calculateOvulationDate(Carbon $nextPeriod): Carbon
    {
        return (clone $nextPeriod)->subDays(14);
    }

    /**
     * Calculate fertile window (5 days before ovulation + 1 day after).
     */
    public function calculateFertileWindow(Carbon $ovulationDate): array
    {
        return [
            'start' => (clone $ovulationDate)->subDays(5),
            'end' => (clone $ovulationDate)->addDay(),
        ];
    }

    /**
     * Get predictions for upcoming cycles (period, ovulation, fertile window).
     */
    public function getPredictions(Collection $cycles, int $futureCycles = 12): array
    {
        if ($cycles->isEmpty()) {
            return [];
        }

        $averageCycleLength = $cycles->count() >= 2
            ? ($this->calculateAverageCycleLength($cycles) ?? 28)
            : 28;

        $lastCycle = $cycles->last();
        $periodLength = $this->getAveragePeriodLength($cycles);
        $confidence = $cycles->count() >= 5 ? 'high' : ($cycles->count() >= 2 ? 'medium' : 'low');

        $nextPeriod = $this->calculateNextPeriod($lastCycle, $averageCycleLength);
        while ($nextPeriod->lt(Carbon::today()->startOfDay())) {
            $nextPeriod = $nextPeriod->copy()->addDays($averageCycleLength);
        }

        $predictions = [];

        for ($i = 0; $i < $futureCycles; $i++) {
            $periodStart = $nextPeriod->copy()->addDays($i * $averageCycleLength);
            $periodEnd = $periodStart->copy()->addDays($periodLength - 1);
            $ovulation = $this->calculateOvulationDate($periodStart);
            $fertileWindow = $this->calculateFertileWindow($ovulation);

            $predictions[] = [
                'type' => 'period',
                'predicted_date' => $periodStart->toDateString(),
                'end_date' => $periodEnd->toDateString(),
                'confidence' => $confidence,
                'cycle_length_avg' => $averageCycleLength,
            ];
            $predictions[] = [
                'type' => 'ovulation',
                'predicted_date' => $ovulation->toDateString(),
                'confidence' => $confidence,
                'cycle_length_avg' => $averageCycleLength,
            ];
            $predictions[] = [
                'type' => 'fertile_window',
                'predicted_date' => $fertileWindow['start']->toDateString(),
                'end_date' => $fertileWindow['end']->toDateString(),
                'confidence' => $confidence,
                'cycle_length_avg' => $averageCycleLength,
            ];
        }

        return $predictions;
    }

    private function getAveragePeriodLength(Collection $cycles): int
    {
        $lengths = $cycles
            ->filter(fn (Cycle $cycle) => $cycle->end_date)
            ->map(fn (Cycle $cycle) => Carbon::parse($cycle->start_date)->diffInDays(Carbon::parse($cycle->end_date)) + 1)
            ->filter(fn (int $length) => $length >= 1 && $length <= 10)
            ->values();

        if ($lengths->isEmpty()) {
            return 5;
        }

        return (int) round($lengths->avg());
    }

    /**
     * Calculate cycle phase based on current day and average length.
     */
    public function getCyclePhase(int $currentDay, int $averageCycleLength = 28): string
    {
        if ($currentDay <= 5) {
            return 'menstruation';
        }

        $ovulationDay = max(1, $averageCycleLength - 14);

        if ($currentDay > 5 && $currentDay < $ovulationDay - 2) {
            return 'follicular';
        }

        if ($currentDay >= $ovulationDay - 2 && $currentDay <= $ovulationDay + 2) {
            return 'ovulation';
        }

        return 'luteal';
    }
}

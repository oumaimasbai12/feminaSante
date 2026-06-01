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
     * Get all predictions (period, ovulation, fertile window).
     */
    public function getPredictions(Collection $cycles): array
    {
        if ($cycles->count() < 2) {
            return [];
        }

        $averageCycleLength = $this->calculateAverageCycleLength($cycles);
        $lastCycle = $cycles->last();

        $nextPeriod = $this->calculateNextPeriod($lastCycle, $averageCycleLength);
        $ovulation = $this->calculateOvulationDate($nextPeriod);
        $fertileWindow = $this->calculateFertileWindow($ovulation);

        $confidence = $cycles->count() >= 5 ? 'high' : 'medium';

        return [
            [
                'type' => 'period',
                'predicted_date' => $nextPeriod->toDateString(),
                'confidence' => $confidence,
                'cycle_length_avg' => $averageCycleLength,
            ],
            [
                'type' => 'ovulation',
                'predicted_date' => $ovulation->toDateString(),
                'confidence' => $confidence,
                'cycle_length_avg' => $averageCycleLength,
            ],
            [
                'type' => 'fertile_window',
                'predicted_date' => $fertileWindow['start']->toDateString(),
                'end_date' => $fertileWindow['end']->toDateString(),
                'confidence' => $confidence,
                'cycle_length_avg' => $averageCycleLength,
            ],
        ];
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

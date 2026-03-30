<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cycle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PredictionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $cycles = Cycle::where('user_id', $request->user()->id)
            ->orderBy('start_date')
            ->get();

        if ($cycles->count() < 2) {
            return response()->json([
                'message' => 'Not enough cycle data to generate predictions.',
                'predictions' => [],
            ]);
        }

        $lengths = [];

        for ($i = 1; $i < $cycles->count(); $i++) {
            $previous = Carbon::parse($cycles[$i - 1]->start_date);
            $current = Carbon::parse($cycles[$i]->start_date);
            $lengths[] = $previous->diffInDays($current);
        }

        $averageCycleLength = round(array_sum($lengths) / count($lengths));

        $lastCycle = $cycles->last();
        $nextPeriod = Carbon::parse($lastCycle->start_date)->addDays($averageCycleLength);
        $ovulation = (clone $nextPeriod)->subDays(14);
        $fertileStart = (clone $ovulation)->subDays(5);
        $fertileEnd = (clone $ovulation)->addDay();

        return response()->json([
            'message' => 'Predictions generated successfully.',
            'predictions' => [
                [
                    'type' => 'period',
                    'predicted_date' => $nextPeriod->toDateString(),
                    'confidence' => 'medium',
                    'cycle_length_avg' => $averageCycleLength,
                ],
                [
                    'type' => 'ovulation',
                    'predicted_date' => $ovulation->toDateString(),
                    'confidence' => 'medium',
                    'cycle_length_avg' => $averageCycleLength,
                ],
                [
                    'type' => 'fertile_window',
                    'predicted_date' => $fertileStart->toDateString(),
                    'end_date' => $fertileEnd->toDateString(),
                    'confidence' => 'medium',
                    'cycle_length_avg' => $averageCycleLength,
                ],
            ],
        ]);
    }
}

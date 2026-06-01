<?php

namespace Database\Seeders;

use App\Models\Cycle;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CycleSeeder extends Seeder
{
    public function run(): void
    {
        $userIds = [1, 2];
        foreach ($userIds as $userId) {
            $startDates = [
                Carbon::now()->subMonths(3)->startOfMonth()->addDays(5),
                Carbon::now()->subMonths(2)->startOfMonth()->addDays(3),
                Carbon::now()->subMonth()->startOfMonth()->addDays(6),
            ];

            foreach ($startDates as $startDate) {
                Cycle::create([
                    'user_id' => $userId,
                    'start_date' => $startDate,
                    'end_date' => $startDate->copy()->addDays(4),
                    'phase' => 'menstruation',
                    'flow_intensity' => 'medium',
                    'mood' => 'calm',
                    'notes' => 'Test cycle',
                ]);
            }
        }
    }
}

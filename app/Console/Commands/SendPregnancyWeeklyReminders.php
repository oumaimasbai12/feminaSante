<?php

namespace App\Console\Commands;

use App\Services\PregnancyService;
use Illuminate\Console\Command;

class SendPregnancyWeeklyReminders extends Command
{
    protected $signature = 'pregnancy:weekly-reminders';

    protected $description = 'Send weekly pregnancy progress tips and milestone reminders';

    public function handle(PregnancyService $pregnancyService): int
    {
        $count = $pregnancyService->sendWeeklyReminders();

        $this->info("Sent {$count} pregnancy reminder(s).");

        return self::SUCCESS;
    }
}

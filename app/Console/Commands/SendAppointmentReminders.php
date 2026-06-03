<?php

namespace App\Console\Commands;

use App\Services\AppointmentReminderService;
use Illuminate\Console\Command;

class SendAppointmentReminders extends Command
{
    protected $signature = 'appointments:send-reminders';

    protected $description = 'Send 24h and 2h appointment reminders to patients and doctors';

    public function handle(AppointmentReminderService $service): int
    {
        $count = $service->sendDueReminders();
        $this->info("Sent {$count} appointment reminder(s).");

        return self::SUCCESS;
    }
}

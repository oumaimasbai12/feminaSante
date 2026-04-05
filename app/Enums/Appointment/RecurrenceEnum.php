<?php

namespace App\Enums\Appointment;

enum RecurrenceEnum: string
{
    case NONE = 'none';
    case WEEKLY = 'weekly';
    case BIWEEKLY = 'biweekly';
    case MONTHLY = 'monthly';
}
